package com.hnv.ui_tool;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.List;

import com.hnv.common.tool.FileTool;

public class HtmlCopyToMain {		
	public static void doCopy_Html (String mainPath, String destPath, String contOld01, String contOld02 , String contNew01, String contNew02, boolean subDir, HashSet<String> excepFName, boolean copyExcepFile, HashSet<String> excepExt, boolean copyExcepExt) {
		int count =0;
		FileTool.canNewDir(destPath);
		List<File> lstJs = FileTool.reqFileList(mainPath, subDir);
		if (excepFName==null) excepFName= new HashSet<String>();		
		for (File f: lstJs) {
			if (f.isDirectory()) continue;
			String origPath = f.getAbsolutePath();
			String newPath 	= origPath.replace(mainPath, destPath);
//			String newPath 	= destPath+File.separator+f.getName(); //for test
			String fname	= f.getName();

			System.out.println("--check=" + origPath + " => " + newPath);
			File fi = new File(newPath);
			fi.getParentFile().mkdirs();

			String ext		= fname.substring(fname.lastIndexOf("."));
			if (ext!=null) ext = ext.toLowerCase();

			if (!excepFName.contains(fname) && !excepExt.contains(ext)) {					
				String 	content =  readResult(origPath);
				if (content!=null && content.length()>0) {
					if (contOld01!=null && contOld01.length()>0) content = content.replace(contOld01, contNew01);
					if (contOld02!=null && contOld02.length()>0) content = content.replace(contOld02, contNew02);
					
					writeResult(new File (newPath), content);
					System.out.println("---copy" );
				}
			}else {
				if ((excepFName.contains(fname) 	&& copyExcepFile) || (excepExt.contains(ext) && copyExcepExt)) {
					//do nothing
				}
			}
		}
		System.out.println("---copy total = " +count);
	}
	
	private static String ioEncoding = "UTF-8";	
	private static void writeResult(File outputFile , String content) {
		try {
			OutputStreamWriter out = new OutputStreamWriter(new FileOutputStream(outputFile), ioEncoding);
			out.write(content); //viet them thi dung append
			out.flush();
			out.close();
		} catch (IOException e) {
			System.err.println("Can not write to " + outputFile.getAbsolutePath());
		}

		System.out.println("Copy file written to " + outputFile.getAbsolutePath());
	} 
	private static String readResult(String inputFile) {
		String content = "";

		try  {
			content = new String ( Files.readAllBytes( Paths.get(inputFile) ) );
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}

		return content;
	} 
	//--------------------------------------------------------------------------------------------------------------------------
	public static void main(String  []a) {
		copy_workAdm();
//		copy_all();
	}
	

	private static HashSet<String> filter 		= new HashSet<String>();
	private static HashSet<String> filterExt 	= new HashSet<String>();
	static {
	}

	private static void copy_all() {
		String mainPath = "WebContent\\html\\all"; //for window, for unix use \
		String destPath = "WebContent"; 

		String oldKey01 = "../../";
		String oldKey02 = null;
		String newKey01 = "";
		String newKey02 = null;

		boolean copyFile 	= true;
		boolean copyExt 	= false;
		doCopy_Html(mainPath, destPath, oldKey01, oldKey02, newKey01, newKey02, true, filter, copyFile, filterExt, copyExt);

	}

	
	
	private static void copy_workAdm() {
		String mainPath = "WebContent\\html\\wordadm.com";
		String destPath = "WebContent"; 

		String oldKey01 = "../../";
		String oldKey02 = "";
		String newKey01 = "";
		String newKey02 = "";

		boolean copyFile 	= true;
		boolean copyExt 	= false;
		doCopy_Html(mainPath, destPath, oldKey01, oldKey02, newKey01, newKey02, true, filter, copyFile, filterExt, copyExt);
	}
}

