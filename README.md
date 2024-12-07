# Multi Model Tester

Use this tool if you want a comparison of AI models running the same prompt/task to check how Modelfile changes effect your models. This will give you a quick performance evaluation, allowing users to assess response times, output quality, and the fastest way to see the impact of Modelfile parameter changes. If constantly comparing different fine-tuned models or want to optimize their performance, save some time and try this. I made it for you

## Features:
- **Run multiple models**: Test a wide range of models and compare their results.
- **Measure performance**: Automatically measure and log the time it takes for each model to process the prompt.
- **Save Results**: View and save model responses, performance times, and charts (Google Charts) to easily compare models.
- **Chart generation**: Generate an HTML report with a Google Chart visualizing the average time taken by each model.
- **JSON export**: Save all results and responses in a structured JSON file for easy access and analysis.

## Installation

### Dependencies

To install the necessary dependencies for the program, use the following command:

```bash
bun install
```

## Usage

Once all dependencies are installed, you can run the program using:

```bash
bun run index.ts
```

### Results Files:

- `data/results.json`: Contains the model responses and performance times for each round of testing.
- `data/comparison_report.html`: Contains a Google Charts visualization comparing the average response times of each model.

## Charting:

If you do not need a chart you can easily disable the chart generation by changing the `enableChart` variable to `false` in the script. This will stop the program from generating and saving the chart, saving processing power.

```typescript
const enableChart = false; // Set to true to enable chart generation
```

## Example Output

Here’s an example of what the terminal output might look like after running a few tests:

```
Testing model: Model1
Round 1: Response from model1...
Generated in 1.25 seconds

Round 2: Response from model1...
Generated in 1.20 seconds

Average Time: 1.23 seconds

Results saved to data/results.json
Chart generated: data/comparison_report.html
```

## Contributing

Feel free to fork the repository, make changes, and submit pull requests. If you encounter any issues or have suggestions for improvements, please open an issue.


This project was created using `bun init` in bun v1.1.24. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

---
