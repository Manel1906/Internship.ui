package com.hnv.ui_tool;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

/*public class NpmTool {
 public static void main(String[] args) throws IOException, InterruptedException {
        // Specify the path to your Node.js project
        String projectPath = "C:\\WS\\dev\\nodeJS";

        // NPM command you want to run (e.g., "npm install", "npm run build", etc.)
        String npmCommand = "npm install";

        // Create a list to hold the command and arguments
        List<String> command = new ArrayList<>();
        command.add("C:\\WS\\dev\\nodeJS\\npm");

        // Set the working directory to your Node.js project
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.directory(new File(projectPath));

        // Start the process
        Process process = processBuilder.start();

        // Read the output (optional)
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }

        // Wait for the process to complete
        int exitCode = process.waitFor();
        System.out.println("Exit code: " + exitCode);
    }
}*/
public class NpmTool {
	public static void main_(String[] args) {
        try {
            // Execute the npm install command
            Process process = Runtime.getRuntime().exec("node");

            // Read the output (optional)
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

            // Wait for the process to complete
            int exitCode = process.waitFor();
            System.out.println("Exit code: " + exitCode);
        } catch (IOException | InterruptedException e) {
            System.out.println("Something went wrong!");
            e.printStackTrace();
        }
    }
	
	public static void doCmdTest() throws Exception {
		ProcessBuilder builder = new ProcessBuilder(
				"cmd.exe", "/c", "cd \"C:\\WS\" && dir && dir && cd \"\\\" && dir");
		builder.redirectErrorStream(true);
		Process p = builder.start();
		BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));
		String line;
		while (true) {
			line = r.readLine();
			if (line == null) { break; }
			System.out.println(line);
		}
	}
	
	public static void doCmdNode() throws Exception {
		ProcessBuilder builder = new ProcessBuilder(
				"cmd.exe", "/c", "D: && cd \"D:\\WS\\NodeJS\\minifyJS\" && dir && node \"Minify.js\"");
		builder.redirectErrorStream(true);
		Process p = builder.start();
		BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));
		String line;
		while (true) {
			line = r.readLine();
			if (line == null) { break; }
			System.out.println(line);
		}
	}
	
	
	public static void main(String[] args) throws Exception{
		doCmdNode();
	}
}
//npm install -g uglify-js 
//uglifyjs C:\WS\git\Zino.ui_Bootstrap\deploy_prod\www\js\app\main\route\CommonRouteController.js -c -m -o C:\WS\git\Zino.ui_Bootstrap\deploy_prod\www\js\app\main\route\CommonRouteController_min.js