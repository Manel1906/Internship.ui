package com.hnv.common.tool;

public class CommonTool {
	public static String reqReplaceStrComment(String text, String beginComment, String endComment) {
		int begin = 0, end =0;
		boolean hasComment = true;
		while (hasComment) {
			begin = text.indexOf(beginComment, begin);
			if (begin>=0) {
				end = text.indexOf(endComment, begin);
				if (end>begin) {
					text = text.substring(0, begin) + text.substring(end+endComment.length());
					hasComment = true;
				}else {
					hasComment = false;
					System.out.println("---$$$$ be carrefull --- no close tag in this line");
				}
			}else hasComment = false;
		}
		return text;
	}
}
