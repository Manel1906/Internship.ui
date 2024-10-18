package com.hnv.common.uglify;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;


/**
 * This class implements a simple Ant task to do almost the same as
 * CommandLineRunner.
 * 
 * Most of the public methods of this class are entry points for the Ant code to
 * hook into.
 * 
 */
public final class UglifyTool {
	
	private static String outputEncoding = "UTF-8";	


	public static void doCompressJS(List<String> src, String output) {

		List<File> sources = findJavaScriptFiles(src);

		if (sources != null) {
			System.out.println("Compiling " + src.size() + " file(s)");

			
			String result = "";
			for (File source : sources) {	
				System.out.println("--- Compiling " + source.getAbsolutePath());
				result += "\n" + UglifyJS.doCompressJS(source.getAbsolutePath());
			}
			
			writeResult(output, result);
			

		} else {
			System.out.println("no source.");
		}
	}

	private static ArrayList<String> createUglifyOptions() {
		UglifyOptions options = new UglifyOptions();
		return options.toArgList();
	}



	/**
	 * Translates an Ant file list into the file format that the compiler
	 * expects.
	 */
	private  static List<File> findJavaScriptFiles (List<String>fileList) {
		List<File> files = new LinkedList<File>();

		for (String file : fileList) {
			files.add(new File(file));
		}

		return files;
	}

	private static void writeResult(String filePath, String source) {
		File outputFile = new File (filePath);
		if (outputFile.getParentFile().mkdirs()) {
			System.err.println("Can not write to " + filePath);
		}

		try {
			OutputStreamWriter out = new OutputStreamWriter(new FileOutputStream(outputFile), outputEncoding);
			out.append(source);
			out.flush();
			out.close();
		} catch (IOException e) {
			System.err.println("Can not write to " + filePath);
		}

		System.out.println("Compiled javascript written to " + filePath);
	}
	
	public static void main(String[] args) {	
		testI18n(args);
	}
	
	
	public static void testCommon(String[] args) {		
		//new UglifyJS().doExec(args);
		
		
		String mainPath = "E:/Git/hnv/em_v2/hnv.em_v2_ui/hnv.em_v2_ui/WebContent/www/js/app/common/";
		String destPath = "E:/Git/hnv/em_v2/hnv.em_v2_ui/hnv.em_v2_ui/WebContent/www/js/app/common/";
		
		String s00 = mainPath + "Queue.js";
		String s01 = mainPath + "BodyTool.js";
		String s02 = mainPath + "BootstrapTool.js";
		String s03 = mainPath + "Network.js";
		String s04 = mainPath + "TemplateController.js";
		String s05 = mainPath + "HandlebarsHelper.js";
				
		String s06 = mainPath + "DatatableTool.js";
		String s07 = mainPath + "DateTool.js";
		String s08 = mainPath + "ExceptionTool.js";		
		String s09 = mainPath + "FunctionTool.js";
		String s10 = mainPath + "SecurityTool.js";	
		String s11 = mainPath + "NotifyTool.js";
		String s12 = mainPath + "LockTool.js";
		String s13 = mainPath + "MsgboxController.js";
		
		String s21 = mainPath + "InputTool.js";		
		String s22 = mainPath + "FileInputTool.js";
		//String s23 = mainPath + "CameraController.js";	=> can not compressed because 	FileInputTool need
		String s24 = mainPath + "UserRightTool.js";
		String s25 = mainPath + "RightController.js";
		String s26 = mainPath + "ChartTool.js";
		
		String s30 = mainPath + "ResizableTool.js";
		String s31 = mainPath + "TourTool.js"; //help
		String s32 = mainPath + "TagTool.js"; //help
		String s33 = mainPath + "URLTool.js";
		
		
		List<String> inputFilename = new ArrayList<String>(); 
		//{s00, s01,s02,s03, s04, s05, s06,s07,s08,s09,s10,s10,s11,s12,s13,s21,s22,s23, s24};
		inputFilename.add(s00);
		inputFilename.add(s01);
		inputFilename.add(s02);
		inputFilename.add(s03);
		inputFilename.add(s04);
		inputFilename.add(s05);
		inputFilename.add(s06);
		inputFilename.add(s07);
		inputFilename.add(s08);
		inputFilename.add(s09);
		inputFilename.add(s10);
		inputFilename.add(s11);
		inputFilename.add(s12);
		inputFilename.add(s13);
		
		
		inputFilename.add(s21);
		inputFilename.add(s22);
		//inputFilename.add(s23);
		inputFilename.add(s24);
		inputFilename.add(s25);
		inputFilename.add(s26);
	
		inputFilename.add(s30);	
		inputFilename.add(s31);
		inputFilename.add(s32);
		inputFilename.add(s33);
		
		
		String outputFilename = destPath + "test.js";
		doCompressJS(inputFilename, outputFilename);	
	}
	
	public static void testI18n(String[] args) {		
		//new UglifyJS().doExec(args);
		
		
		String mainPath = "E:/Git/hnv/em_v2/hnv.em_v2_ui/hnv.em_v2_ui/WebContent/www/js/lib/i18n/";
		String destPath = "E:/Git/hnv/em_v2/hnv.em_v2_ui/hnv.em_v2_ui/WebContent/www/js/lib/i18n/";
		
		String s00 = mainPath + "jquery.i18n.js";
		String s01 = mainPath + "jquery.i18n.messagestore.js";
		String s02 = mainPath + "jquery.i18n.fallbacks.js";
		String s03 = mainPath + "jquery.i18n.parser.js";
		String s04 = mainPath + "jquery.i18n.emitter.js";
		String s05 = mainPath + "jquery.i18n.language.js";
				
				
		List<String> inputFilename = new ArrayList<String>(); 
		//{s00, s01,s02,s03, s04, s05, s06,s07,s08,s09,s10,s10,s11,s12,s13,s21,s22,s23, s24};
		inputFilename.add(s00);
		inputFilename.add(s01);
		inputFilename.add(s02);
		inputFilename.add(s03);
		inputFilename.add(s04);
		inputFilename.add(s05);
		
				
		String outputFilename = destPath + "jquery.i18n.all.js";
		doCompressJS(inputFilename, outputFilename);	
	}
}
