package com.hnv.ui_tool;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;


public class CombineJS {
	static String[]main_css_paths = {
			
			"WebContent/www/js/app/common/ctrl/CommonTool.js",
			
			"WebContent/www/js/app/common/ctrl/NetworkController.js",
			"WebContent/www/js/app/common/ctrl/TemplateController.js",
			"WebContent/www/js/app/common/ctrl/HandlebarsHelper.js",
			
			
			"WebContent/www/js/app/common/ctrl/SummerNoteController.js",
			"WebContent/www/js/app/common/ctrl/MsgboxController_New.js",
			"WebContent/www/js/app/common/ctrl/NotifyTool.js",
			
			"WebContent/www/js/app/common/ctrl/SecurityTool.js",
			"WebContent/www/js/app/common/ctrl/UserRightTool.js",
			
			"WebContent/www/js/app/common/ctrl/BodyTool.js",
			"WebContent/www/js/app/common/ctrl/BootstrapTool.js",
			"WebContent/www/js/app/common/ctrl/DatatableTool.js",
			"WebContent/www/js/app/common/ctrl/DateTool.js",
			
			
			"WebContent/www/js/app/common/ctrl/PaginationTool.js",
			"WebContent/www/js/app/common/ctrl/InputTool.js",
			"WebContent/www/js/app/common/ctrl/FileInputTool.js",
			    
		    
			"WebContent/www/js/app/common/ctrl/ChartTool.js",
			"WebContent/www/js/app/common/ctrl/BarRatingTool.js",
		    
			"WebContent/www/js/app/common/ctrl/RTCTool.js",
//			"WebContent/www/js/app/common/ctrl/ChatboxController.js",
	};	
	
	static String file_01_Dest = "WebContent/www/js/app/common/ctrl/All_Tool.js";
	
	private static String replaceComment(String text) {
		int begin = 0, end =0;
		boolean hasComment = true;
		while (hasComment) {
			begin = text.indexOf("/*", begin);
			if (begin>=0) {
				end = text.indexOf("*/", begin);
				if (end>begin) {
					text = text.substring(0, begin) + text.substring(end+2);
					hasComment = true;
				}else hasComment = false;
			}else hasComment = false;
		}
		return text;
	}
	
	private static String replaceCommentLine(String text) {
		int begin = 0, end =0;
		begin = text.indexOf("//", begin);
		if (begin>=0) 
			text = text.substring(0, begin);
		return text;
	}
	private static void combine(String[] paths, String file) {
		try {
			StringBuffer content = new StringBuffer("");
			FileWriter fileWriter =  new FileWriter(file);
			BufferedWriter bufferedWriter =  new BufferedWriter(fileWriter);
			for (String fileName:paths) {
				System.out.println();
				System.out.println("---------------------------------------------------------------------");
				System.out.println(fileName);
				System.out.println("---------------------------------------------------------------------");
				
				String line = null;
				try {
					FileReader fileReader = new FileReader(fileName);
					BufferedReader bufferedReader = new BufferedReader(fileReader);


					while((line = bufferedReader.readLine()) != null) {
//						line = replaceCommentLine(line);
						if (line.length()>0) {
							content.append(line + "\n");
						}
					}   

					bufferedReader.close();  

					String text = content.toString();
//					text = replaceComment(text);
					
					bufferedWriter.newLine();
					bufferedWriter.write("//-----"+ fileName + "------------------------------");
					bufferedWriter.newLine();
					bufferedWriter.write(text);
					content = new StringBuffer("");
					bufferedWriter.newLine();
				}
				catch(Exception ex) {
					System.out.println(
							"Unable to open file '" + 
									fileName + "'");                
				}

			}
			bufferedWriter.close();
		}catch(Exception ex2) {
			System.out.println(
					"Unable to open file '" + 	file_01_Dest + "'");                
		}
	}
	
	public static void main(String[] args) {	
		combine(main_css_paths			, file_01_Dest);
	}

}
