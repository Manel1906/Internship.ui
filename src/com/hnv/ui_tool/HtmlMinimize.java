package com.hnv.ui_tool;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import com.hnv.common.tool.CommonTool;
import com.hnv.common.tool.FileTool;
import com.hnv.common.uglify.UglifyJS;


public class HtmlMinimize {	
	
	private static String replaceSpace(String text) {
		while(text.indexOf("\t")>=0)	text = text.replace("\t", " ");
		while(text.indexOf("  ")>=0) 	text = text.replace("  ", " ");
		
		text = text.replace("> {", ">{");
		text = text.replace("} <", "}<");
		text = text.replace("> <", "><");
		text = text.replace("} {", "}{");
		
		text = text.replace("{ ", "{");
		text = text.replace(" }", "}");
		
		text = text.replace("< ", "<");
		text = text.replace("> ", ">");
		
		text = text.replace(" : ", ":");
		text = text.replace(": ", ":");
		text = text.replace(" :", ":");
		
		return text;
	}
	
	static String key_01 	= "<!--BEGIN TMPL-->";
	static String key_02 	= "<!--END TMPL-->";
	static String key_03	= "<!--NAME TMPL:";
	public static void doMinimize(String src, String dest) {
		try {
			StringBuffer 	content 		= new StringBuffer("");
			FileWriter 		fileWriter 		=  new FileWriter(dest);
			BufferedWriter bufferedWriter 	=  new BufferedWriter(fileWriter);
			System.out.println("-----"+src);
			String line = null;
			try {
				FileReader fileReader = new FileReader(src);
				BufferedReader bufferedReader = new BufferedReader(fileReader);


				while((line = bufferedReader.readLine()) != null) {
					System.out.println("html 1---"+ line);
					
					line = replaceSpace(line);

					int keep	= line.indexOf(key_01);
					if (keep<0) keep= line.indexOf(key_02);
					if (keep<0) keep= line.indexOf(key_03);
					if (keep<0) {
						line = CommonTool.reqReplaceStrComment(line, "<!--", "-->");
					}
					line = line.trim();
					if (line.length()>0) content.append(" " + line);
					System.out.println("html 2---"+ line);
				}
				bufferedReader.close();  

				String text = content.toString();
				text = replaceSpace (text);
				
//				co van de voi begin templ
//				System.out.println(text);
//				text = CommonTool.reqReplaceStrComment(text, "<!--", "-->");
//				System.out.println(text);
				bufferedWriter.write(text);
			}
			catch(Exception ex) {
				System.out.println(
						"Unable to open file '" + 
								src + "'");                
			}

			bufferedWriter.close();
		}catch(Exception ex2) {
			System.out.println(
					"Unable to open file '" + 	dest + "'");                
		}
	}	
}