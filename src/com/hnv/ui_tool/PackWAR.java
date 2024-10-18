package com.hnv.ui_tool;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import com.hnv.common.tool.FileTool;

public class PackWAR {
    public static void main(String[] args) throws Exception {
    	NpmTool.doCmdNode();
    	
        String sourceFolder = "D:\\WS\\git\\zino.ui_bootstrap\\deploy_prod";
        String zipFilePath 	= "D:\\WS\\git\\zino.ui_bootstrap\\livr\\ROOT.war";
        zipFolder(sourceFolder, zipFilePath);
    }

    public static void zipFolder(String sourceFolder, String outputZipFile) {
        try {
        	FileTool.canNewDirParent(outputZipFile);
            FileOutputStream fos = new FileOutputStream(outputZipFile);
            ZipOutputStream zos = new ZipOutputStream(fos);

            File sourceFile = new File(sourceFolder);
            zipFolder(sourceFile, null, zos); //--skip folder name

            zos.close();
            fos.close();
            System.out.println("Folder successfully compressed to " + outputZipFile);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private static void zipFolder( File folder, String parentFolder, ZipOutputStream zos) throws IOException {
        for (File file : folder.listFiles()) {
        	try {
        		if (file.isDirectory()) {
                	zipFolder(file, (parentFolder!=null?(parentFolder + "/"):"") + file.getName(), zos);
                    continue;
                }
        		
        		
                zos.putNextEntry(new ZipEntry((parentFolder!=null?(parentFolder + "/"):"") + file.getName()));

                BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file));
                long bytesRead;
                byte[] bytesIn = new byte[4096];
                while ((bytesRead = bis.read(bytesIn)) != -1) {
                    zos.write(bytesIn, 0, (int)bytesRead);
                }
                bis.close();
                zos.closeEntry();
        	} catch (Exception e) {
                e.printStackTrace();
            }
            
        }
    }
    
    
}


