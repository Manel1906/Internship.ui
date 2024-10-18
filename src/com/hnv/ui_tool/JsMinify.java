package com.hnv.ui_tool;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import com.hnv.common.tool.FileTool;
import com.hnv.common.uglify.UglifyJS;


public class JsMinify {	
	private static String outputEncoding = "UTF-8";	
	private static void writeResult(File outputFile , String content) {
		try {
			OutputStreamWriter out = new OutputStreamWriter(new FileOutputStream(outputFile), outputEncoding);
			out.write(content); //viet them thi dung append
			out.flush();
			out.close();
		} catch (IOException e) {
			System.err.println("Can not write to " + outputFile.getAbsolutePath());
		}

		System.out.println("Compiled javascript written to " + outputFile.getAbsolutePath());
	} 
	public static void doMinimize_Html_SkipJS (String mainPath, String destPath, String oldKey01, String oldKey02 , String newKey01, String newKey02, boolean subDir, HashSet<String> excepFName, boolean copyExcepFile, HashSet<String> excepExt, boolean copyExcepExt) {
		FileTool.canNewDir(destPath);
		List<File> lstJs = FileTool.reqFileList(mainPath, subDir);
		if (excepFName==null) excepFName= new HashSet<String>();
		for (File f: lstJs) {
			if (f.isDirectory()) continue;
			String origPath = f.getAbsolutePath();
			String newPath 	= origPath.replace(mainPath, destPath).replace(oldKey01, newKey01).replace(oldKey02, newKey02);
			String fname	= f.getName();


			System.out.println("--check=" + origPath + " => " + newPath);
			File fi = new File(newPath);
			fi.getParentFile().mkdirs();

			String ext		= fname.substring(fname.lastIndexOf("."));
			if (ext!=null) ext = ext.toLowerCase();
			
			if (!excepFName.contains(fname) && !excepExt.contains(ext)) {
				boolean ok		= false;
				if (ext.equals("js") || ext.equals(".js")) {
					ok = true;
				}else if (ext.equals("html") || ext.equals(".html")) {
					HtmlMinimize.doMinimize(origPath, newPath);
					System.out.println("---htmlMin");
					ok = true;
				}
				//-----------------------------------------------------
				if (!ok) {
					if (FileTool.canCopyFile(origPath, newPath))
						System.out.println("---copy");
					else
						System.out.println("---fail");
				}
			}else {
				if ((excepFName.contains(fname) 	&& copyExcepFile) || (excepExt.contains(ext) && copyExcepExt)) {
					if (FileTool.canCopyFile(origPath, newPath))
						System.out.println("---copy");
					else
						System.out.println("---fail");
				}
			}
		}

	}
	public static void doMinimize_Js_Html (String mainPath, String destPath, String oldKey01, String oldKey02 , String newKey01, String newKey02, boolean subDir, HashSet<String> excepFName, boolean copyExcepFile, HashSet<String> excepExt, boolean copyExcepExt) {
		FileTool.canNewDir(destPath);
		List<File> lstJs = FileTool.reqFileList(mainPath, subDir);
		if (excepFName==null) excepFName= new HashSet<String>();
		String keyOld = "APP_ENV=0";
		String keyNew = "APP_ENV=1";
		for (File f: lstJs) {
			if (f.isDirectory()) continue;
			String origPath = f.getAbsolutePath();
			String newPath 	= origPath.replace(mainPath, destPath).replace(oldKey01, newKey01).replace(oldKey02, newKey02);
			String fname	= f.getName();



			System.out.println("--check=" + origPath + " => " + newPath);
			File fi = new File(newPath);
			fi.getParentFile().mkdirs();

			String ext		= fname.substring(fname.lastIndexOf("."));
			if (ext!=null) ext = ext.toLowerCase();
			
			if (!excepFName.contains(fname) && !excepExt.contains(ext)) {
				boolean ok		= false;
				if (ext.equals("js") || ext.equals(".js")) {
					try {
						String 	content =  UglifyJS.doCompressJS(origPath);
						if (content!=null && content.length()>0) {
							if (fname.equals("app.js")) content = content.replace(keyOld, keyNew);
							writeResult(new File (newPath), content);
							System.out.println("---compress" );
							ok = true;
						}
					}catch(Exception e) {
						System.out.println("---can not minimize");
					}
				}else if (ext.equals("html") || ext.equals(".html")) {
					HtmlMinimize.doMinimize(origPath, newPath);
					System.out.println("---htmlMin");
					ok = true;
				}
				//-----------------------------------------------------
				if (!ok) {
					if (FileTool.canCopyFile(origPath, newPath))
						System.out.println("---copy");
					else
						System.out.println("---fail");
				}
			}else {
				if ((excepFName.contains(fname) 	&& copyExcepFile) || (excepExt.contains(ext) && copyExcepExt)) {
					if (FileTool.canCopyFile(origPath, newPath))
						System.out.println("---copy");
					else
						System.out.println("---fail");
				}
			}
		}

	}

	public static void doCopy_Js_Html (String mainPath, String destPath, String oldKey01, String oldKey02 , String newKey01, String newKey02, boolean subDir, HashSet<String> excepFName, boolean copyExcepFile, HashSet<String> excepExt, boolean copyExcepExt) {
		FileTool.canNewDir(destPath);
		List<File> lstJs = FileTool.reqFileList(mainPath, subDir);
		if (excepFName==null) excepFName= new HashSet<String>();		
		for (File f: lstJs) {
			if (f.isDirectory()) continue;
			String origPath = f.getAbsolutePath();
			String newPath 	= origPath.replace(mainPath, destPath).replace(oldKey01, newKey01).replace(oldKey02, newKey02);
			String fname	= f.getName();



			System.out.println("--check=" + origPath + " => " + newPath);
			File fi = new File(newPath);
			fi.getParentFile().mkdirs();

			String ext		= fname.substring(fname.lastIndexOf("."));
			if (ext!=null) ext = ext.toLowerCase();
			
			if (!excepFName.contains(fname) && !excepExt.contains(ext)) {
				
					if (FileTool.canCopyFile(origPath, newPath))
						System.out.println("---copy");
					
			}else {
				if ((excepFName.contains(fname) 	&& copyExcepFile) || (excepExt.contains(ext) && copyExcepExt)) {
					//do nothing
				}
			}
		}

	}
	//--------------------------------------------------------------------------------------------------------------------------
	public static void main(String  []a) {
//		filterExt.add(".js");
//		filterExt.add("js");
		
//		build_MainJS();
//		build_AppJS();
//		build_LibJS();
		
		buildHtml();
	}
	
	private static HashSet<String> filter 		= new HashSet<String>();
	private static HashSet<String> filterExt 	= new HashSet<String>();
	static {
		filter.add("bootstrap-slider.js");
		filter.add("require.js");
		filter.add("All_Tool.js");
		
		filter.add("FileInputTool.js");
		filter.add("FileURLController.js");
		filter.add("CameraController.js");
	}
	
	public static void buildHtml() {
		String mainPath = "WebContent";
		String destPath = "deploy_prod";

		String oldKey01 = "";
		String oldKey02 = "";
		String newKey01 = "";
		String newKey02 = "";

		boolean copyFile = true;
		boolean copyExt = true;
		doMinimize_Html_SkipJS(mainPath, destPath, oldKey01, oldKey02, newKey01, newKey02, true, filter, copyFile, filterExt, copyExt);
		
	}
	
	public static void buildAll() {
		String mainPath = "WebContent";
		String destPath = "deploy_prod";

		String oldKey01 = "";
		String oldKey02 = "";
		String newKey01 = "";
		String newKey02 = "";

		boolean copyFile = true;
		boolean copyExt = true;
		doMinimize_Js_Html(mainPath, destPath, oldKey01, oldKey02, newKey01, newKey02, true, filter, copyFile, filterExt, copyExt);
		
	}
	
	public static void build_AppJS() {
		String mainPath = "WebContent\\www\\js\\app";
		String destPath = "deploy_prod\\www\\js\\app";

		String oldKey01 = "www\\js\\";
		String oldKey02 = "www/js/";
		String newKey01 = "www\\js\\";
		String newKey02 = "www/js/";

		boolean copyFile = true;
		boolean copyExt	 = true;
		doMinimize_Js_Html(mainPath, destPath, oldKey01, oldKey02, newKey01, newKey02, true, filter, copyFile, filterExt, copyExt);
		
	}
	
	public static void build_LibJS() {
		String mainPath = "WebContent\\www\\js\\lib";
		String destPath = "deploy_prod\\www\\js\\lib";
		
		String oldKey01 = "www\\js\\";
		String oldKey02 = "www/js/";
		String newKey01 = "www\\js\\";
		String newKey02 = "www/js/";

		boolean copyFile = true;
		boolean copyExt = true;
		doCopy_Js_Html(mainPath, destPath, oldKey01, oldKey02, newKey01, newKey02, true, filter, copyFile, filterExt, copyExt);
		
	}
	
	public static void build_MainJS() {
		String mainPath = "WebContent\\www\\js";
		String destPath = "deploy_prod\\www\\js";

		String oldKey01 = "WebContent\\www\\js";
		String newKey01 = "deploy_prod\\www\\js";
		
		String oldKey02 = "www/js/";
		String newKey02 = "www/js/";

		boolean copyFile = true;
		boolean copyExt = true;
		doMinimize_Js_Html(mainPath, destPath, oldKey01, oldKey02, newKey01, newKey02, true, filter, copyFile, filterExt, copyExt);
		
		copyFile = true;
		copyExt = true;
		doMinimize_Js_Html(mainPath, destPath, oldKey01, oldKey02, newKey01, newKey02, false, filter, copyFile, filterExt, copyExt);
		
	}

}

