import ollama from "ollama";
import inquirer, { QuestionCollection } from "inquirer";
import fs from "fs";
import path from "path";

const qrepeat = 5;
const enableChart = true; // Set to false to skip chart generation
const dataFolder = path.join(__dirname, 'data');

// Ensure the "data" folder exists
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder);
}

// Fetch all models
const allmodels = await ollama.list();

// Process model names
function processModelNames(allmodels: { name: string }[]) {
  return allmodels.map((model) => model.name).sort();
}

// Get models to compare
async function getSelectedModels(names: string[]) {
  const questions: QuestionCollection = [
    {
      type: "checkbox",
      name: "selectedNames",
      message: "Select the models you want to compare:",
      choices: names,
    },
  ];
  const answer = await inquirer.prompt(questions);
  return answer.selectedNames;
}

// Get user prompt
async function getUserPrompt(): Promise<string> {
  const questions: QuestionCollection = [
    {
      type: "input",
      name: "userPrompt",
      message: "Enter a prompt you want to test:",
    },
  ];
  const answer = await inquirer.prompt(questions);
  return answer.userPrompt;
}

// Generate HTML report with Google Charts
function generateChart(data: { model: string; avgTime: number }[]) {
  const chartData = data
    .map((result) => `['${result.model}', ${result.avgTime}]`)
    .join(",\n");

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Model Performance Comparison</title>
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <script type="text/javascript">
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      const data = google.visualization.arrayToDataTable([
        ['Model', 'Average Time (ms)'],
        ${chartData}
      ]);
      const options = {
        title: 'Model Performance Comparison',
        hAxis: { title: 'Models' },
        vAxis: { title: 'Average Time (ms)' },
        legend: { position: 'none' }
      };
      const chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }
  </script>
</head>
<body>
  <h1>Model Performance Comparison</h1>
  <div id="chart_div" style="width: 900px; height: 500px;"></div>
</body>
</html>
`;

  fs.writeFileSync(path.join(dataFolder, 'comparison_report.html'), htmlContent);
  console.log("Chart generated: data/comparison_report.html");
}

// Main Logic
const names = processModelNames(allmodels.models);
const selectedModels = await getSelectedModels(names);
const userPrompt = await getUserPrompt();

const results: { model: string; avgTime: number; responses: string[] }[] = [];

for (const model of selectedModels) {
  console.log(`\nTesting model: ${model}\n`);
  const times: number[] = [];
  const responses: string[] = [];

  for (let i = 0; i < qrepeat; i++) {
    const startTime = performance.now();
    try {
      console.time("Generate");
      const output = await ollama.generate({
        model,
        prompt: userPrompt,
      });
      const endTime = performance.now();
      console.timeEnd("Generate");

      const duration = endTime - startTime;
      times.push(duration);
      responses.push(output.response); // Save response

      console.log(
        `\n${model} round ${i + 1}:\nResponse:\n${output.response}\nGenerated in ${(duration / 1000).toFixed(2)} seconds\n`
      );
    } catch (error) {
      console.error(`Error running model ${model} round ${i + 1}:`, error);
    }

    if (i < qrepeat - 1) {
      console.log("--------\n");
    }
  }

  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(`\n${model} Average Time: ${(avgTime / 1000).toFixed(2)} seconds`);
  
  // Push results including responses
  results.push({ model, avgTime, responses });
}

// Save results to JSON
fs.writeFileSync(path.join(dataFolder, 'results.json'), JSON.stringify(results, null, 2));
console.log("Results saved to data/results.json");

// Generate chart if enabled
if (enableChart) {
  generateChart(results);
}
