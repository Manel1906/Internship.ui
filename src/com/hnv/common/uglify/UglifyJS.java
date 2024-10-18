package com.hnv.common.uglify;

import java.io.InputStreamReader;
import java.io.Reader;

import javax.script.ScriptEngine;
import javax.script.ScriptException;



public class UglifyJS {

	public static void main(String[] args) {		
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
		String s23 = mainPath + "URLTool.js";
		String s24 = mainPath + "UserRightTool.js";
		
		
		
		
		
		String[] inputFilename = {	s00, s01,s02,s03, s04, s05, s06,s07,s08,s09,s10,s10,s11,s12,s13,
									s21,s22,s23, s24};
		String outputFilename = destPath + "test.js";
		String s = UglifyJS.doCompressJS(inputFilename, outputFilename);	
		System.out.println(s);
	}

	public static Reader reqResourceReader(String url) {
		Reader reader = null;		
		try {			
			if(reader == null) {
				reader = new InputStreamReader(UglifyJS.class.getClassLoader().getResourceAsStream(url));
			}
			
			/*
			if (reader == null) {
				reader = new InputStreamReader(getClass().getResourceAsStream("../"+url));
			}

			if (reader == null) {
				reader = new InputStreamReader(getClass().getResourceAsStream("/"+url));
			}
			*/
		} catch (Exception e) {
			e.printStackTrace();
		}

		return reader;
	}

	
	public static String doCompressJS(String[] fileInp, String fileOut) {
		ScriptEngine engine = ECMAScriptEngineFactory.reqECMAScriptEngine();
		
//		String [] args = new String[fileInp.length+2];
//		System.arraycopy(fileInp, 0, args, 0, fileInp.length);
//		args[fileInp.length] 	= "-o";
//		args[fileInp.length+1] 	= fileOut;
		
		String [] args = new String[3];
		System.arraycopy(fileInp, 0, args, 0, 1);
		//args[1] 	= "-o";
		args[1] 	= "";
		
		engine.put("uglify_args", args);
		engine.put("uglify_no_output", false);
		run(engine);
		
		try {
			return (String)engine.eval("uglify();");
		} catch (ScriptException e) {
			e.printStackTrace();
		}
		return "";
	}
	
	public static String doCompressJS(String fileInp) {
		ScriptEngine engine = ECMAScriptEngineFactory.reqECMAScriptEngine();
				
		String [] args 	= new String[4];
		args[0] 		= fileInp;
		args[1] 		= "-nc";
		args[2] 		= "-0"; //no output
		args[3] 		= "tmp";//useless
		
		engine.put("uglify_args", args);
		engine.put("uglify_no_output", true);
		run(engine);
		
		try {
			return (String)engine.eval("uglify();");
		} catch (ScriptException e) {
			e.printStackTrace();
		}
		return "";
	}
	
	public static void doExec(String[] args) {
		ScriptEngine engine = ECMAScriptEngineFactory.reqECMAScriptEngine();
		engine.put("uglify_args", args);
		engine.put("uglify_no_output", false);
		run(engine);
		
		try {
			engine.eval("uglify();");
		} catch (ScriptException e) {
			e.printStackTrace();
		}
	}
	
	
	private static void run(ScriptEngine engine) {
		try {

			Reader parsejsReader 	= reqResourceReader("com/hnv/common_tool/uglify/js/parse-js.js");
			Reader processjsReader 	= reqResourceReader("com/hnv/common_tool/uglify/js/process.js");
			Reader sysjsReader 		= reqResourceReader("com/hnv/common_tool/uglify/js/adapter/sys.js");
			Reader jsonjsReader 	= reqResourceReader("com/hnv/common_tool/uglify/js/adapter/JSON.js");
			Reader arrayjsReader 	= reqResourceReader("com/hnv/common_tool/uglify/js/adapter/Array.js");
			Reader uglifyjsReader 	= reqResourceReader("com/hnv/common_tool/uglify/js/uglifyjs.js");

			engine.eval(jsonjsReader);
			engine.eval(arrayjsReader);
			engine.eval(sysjsReader);
			engine.eval(parsejsReader);
			engine.eval(processjsReader);
			engine.eval(uglifyjsReader);

		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

	public static String doUglify(String[] args){		
		
		ScriptEngine engine = ECMAScriptEngineFactory.reqECMAScriptEngine();
		engine.put("uglify_args", args);
		engine.put("uglify_no_output", false);
		run(engine);
		
		String result = null;		
		try {
			result = (String)engine.eval("uglify();");
		} catch (ScriptException e) {
			e.printStackTrace();
		}		
		
		return result;
	}
	
	
}
