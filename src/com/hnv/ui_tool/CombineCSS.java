package com.hnv.ui_tool;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;


public class CombineCSS {
	static String[]main_css_paths = {
			
			"WebContent/www/js/lib/bootstrap-datepicker/css/bootstrap-datepicker.min.css",
			"WebContent/www/js/lib/bootstrap-timepicker/css/bootstrap-timepicker.min.css",
			"WebContent/www/js/lib/swiper/swiper-bundle.min.css",
			"WebContent/www/js/lib/dropzone/min/dropzone.min.css",
			"WebContent/www/js/lib/jquery-barrating/themes/fontawesome-stars-custom.css",
			"WebContent/www/js/lib/jquery-barrating/themes/fontawesome-stars.css",
			"WebContent/www/js/lib/jquery-barrating/themes/fontawesome-stars-o.css",
			"WebContent/www/js/lib/jquery-barrating/themes/css-stars.css",
			"WebContent/www/js/lib/jquery-barrating/themes/bootstrap-stars.css",
			"WebContent/www/js/lib/summernote/summernote-bs4.min.css",
			"WebContent/www/js/lib/summernote/emoji/css/emoji-summernote.css",
			"WebContent/www/js/lib/dragula/dragula.min.css",
			"WebContent/www/js/lib/select2/select2.min.css",
			"WebContent/www/js/lib/daypilot/workadm.css",
			"WebContent/www/js/lib/daypilot/daypilot_icon.css",
			"WebContent/www/js/lib/daypilot/calendar_green.css",
			"WebContent/www/js/lib/imageviewer/viewer.css",
			
			
//			"WebContent/www/js/lib/jsplumb/css/jsplumbtoolkit-defaults.css",
			"WebContent/www/js/lib/jsplumb/css/main.css",
//			"WebContent/www/js/lib/jsplumb/css/jsplumbtoolkit-demo.css",
//			"WebContent/www/js/lib/jsplumb/demo.css",
			
			"WebContent/www/js/lib/flowchart/jquery.flowchart.css",
			
			"WebContent/www/css/prj/bootstrap.min.css",
			"WebContent/www/css/prj/icons.min.css",
			"WebContent/www/css/prj/app.min.css",
			"WebContent/www/css/prj/_main-prj.css",
			"WebContent/www/css/prj/custom_pagination.css",
			"WebContent/www/css/prj/_responsive.css",
			"WebContent/www/css/prj/custom_box.css",
			"WebContent/www/css/prj/emojis.css",
			"WebContent/www/css/prj/custom_chat.css"
			

	};	
	
	static String file_01_Dest 	= "WebContent/www/css/min/css_all.css";
	static String[] url_Local 	= {"url(../../fonts/", "url(../../img/"};
	static String[] url_Cdn 	= {"url(https://zino.pages.dev/www/fonts/", "url(https://zino.pages.dev/www/img/"};
	
	static String[] txt_Old 	= {"../fonts/", "../img/"};
	static String[] txt_New 	= {"./fonts/" , "./img/"};
	
	private static String replaceSpace(String text) {
		text = text.replace("  ", " ");
		text = text.replace("\t", "");
		text = text.replace("  ", " ");
		text = text.replace(" { ", "{");
		text = text.replace(" } ", "}");
		text = text.replace(" {", "{");
		text = text.replace(" }", "}");
		text = text.replace("{ ", "{");
		text = text.replace("} ", "}");
		text = text.replace(" : ", ":");
		text = text.replace(": ", ":");
		text = text.replace(" :", ":");
		return text;
	}
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
//						System.out.println(line);
						line = replaceSpace(line);
						line = replaceComment(line);
						if (line.length()>0) content.append(line);
					}   

					bufferedReader.close();  

					String text = content.toString();
					System.out.println("1:: " +text);
					text = replaceSpace(text);
					System.out.println("2:: " +text);
					text = replaceComment(text);
					System.out.println("3:: " +text);
					
					if (url_Local.length>0) {
						for (int i=0;i<url_Local.length;i++) {
							String txtOld = url_Local[i];
							String txtNew = url_Cdn[i];
							text = text.replace(txtOld, txtNew);
						}
					}
					
					for (int i=0;i<txt_Old.length;i++) {
						String txtOld = txt_Old[i];
						String txtNew = txt_New[i];
						text = text.replace(txtOld, txtNew);
					}
					
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
