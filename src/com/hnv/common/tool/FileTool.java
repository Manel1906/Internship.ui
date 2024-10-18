package com.hnv.common.tool;



import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import java.net.URL;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.nio.file.FileStore;
import java.nio.file.FileSystemException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.security.SecureRandom;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Hashtable;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.TimeUnit;

import javax.swing.filechooser.FileSystemView;

public class FileTool {
	private static final String[] regex = {"[",  "]",   "/",  "?",  "|",  "<",  ">", ";", "," ,"\"", "\'", "!",  "+", "-", "*", ":","\\",};	
	private static final String  regexSt = "[\\[\\]\\/\\?\\|\\<\\>\\]\\;\\,\\\"\\\'\\!\\+\\-\\*\\:\\\\]";
	private final static int BUFFER_SIZE = 8192;

	public static String reqSanitizeFilename(String name) {
		//String tmp = name.replace("\\", "_");
		String tmp = name;
		tmp= tmp.replaceAll(regexSt, "");

		/*for (String s: regex)
			tmp = tmp.replace(s, "_");*/
		return tmp;
	}

	public static boolean canRename(String oldName, String newName, boolean delNewIfExist){
		File f1 = new File(oldName);
		File f2 = new File(newName);
		if (!f1.exists()) return false;
		if (f2.exists()) {
			if (delNewIfExist) 
				canDelFile(newName);
			else 
				return false;
		}

		return f1.renameTo(f2);
	}

	public static boolean canBeLockedByApp(String path){
		File f = new File(path);
		if (!f.exists()) return false;		

		FileChannel channel =null; 
		try{
			RandomAccessFile fr = new RandomAccessFile(f, "rw");
			channel = fr.getChannel();
			FileLock fl = channel.tryLock();
			if (fl!=null) {
				fl.release();
				channel.close();
				fr.close();

				if (!canBeClosed(f)) return true; //check them neu la linux
				return false;
			}else{
				channel.close();
				fr.close();
				return true;
			}			
		}catch(Exception e){			
			return true;
		}
	}

	//with unix sytem
	private static boolean canBeClosed(File file) {
		Process plsof = null; 
		BufferedReader reader = null;
		try {
			plsof = new ProcessBuilder(new String[]{"lsof", "|", "grep", file.getAbsolutePath()}).start();
			reader = new BufferedReader(new InputStreamReader(plsof.getInputStream()));
			String line;
			while((line=reader.readLine())!=null) {
				if(line.contains(file.getAbsolutePath())) {                            
					reader.close();
					plsof.destroy();
					return false;
				}
			}
		} catch(Exception ex) {
			// TODO: handle exception ...
		}
		try{
			if (reader!=null) reader.close();
			if (plsof!=null) plsof.destroy();
		}catch(Exception e){

		}	
		return true;
	}



	public static void doOpenDir(String path){
		File f = new File(path);
		try{
			if (f.isFile()) f = f.getParentFile();
			if (java.awt.Desktop.isDesktopSupported()) {
				if (f.isFile()) 
					java.awt.Desktop.getDesktop().open(f.getParentFile());	
				else
					java.awt.Desktop.getDesktop().open(f);
			}

		}catch(Exception e){

		}
	}


	public static void doSetHidden(boolean hidden, String pathS){
		try{
			Path path = FileSystems.getDefault().getPath(pathS);
			Files.setAttribute(path,"dos:hidden", hidden, LinkOption.NOFOLLOW_LINKS);
		}catch(Exception e){			
		}		
	}

	public static boolean canBeEmpty(String path){
		File f = new File(path);
		return f.listFiles().length==0;
	}

	/*
	public static boolean delFile(String path){
		File f = new File(path);
		if (f.exists()) return f.delete();
		return true;
	}
	public static boolean delFile(File f){		
		if (f.exists()) return f.delete();
		return true;
	}*/

	public static boolean canExist(String path) {
		File f = new File(path);
		return f.exists();
	}

	public static boolean canExist(File f) {		
		return f.exists();
	}

	public static long reqFileSize(String path){
		File f = new File(path);
		if(!f.exists()) return 0;
		if (f.isDirectory()) {
			long s = 0;
			File[] child = f.listFiles();
			for (File t: child) s+= reqFileSize(t);
			return s;
		}
		return f.length();
	}

	public static long reqFileSize(File f){		
		if(!f.exists()) return 0;
		if (f.isDirectory()) {
			long s = 0;
			File[] child = f.listFiles();
			for (File t: child) s+= reqFileSize(t);
			return s;
		}
		return f.length();
	}

	public static File reqMkFile(String path){		
		File f = new File(path);
		f.getName();
		reqMkDirs(f.getParent());
		try {
			PrintWriter writer = new PrintWriter(f.getPath());
			writer.write(0);
			writer.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return f;
	}
	public static File reqMkDirs(String path) {
		File f = new File(path);
		if (!f.exists())
			f.mkdirs();
		return f;
	}

	public static void reqMkDirsParent(String path) {
		File f = new File(path);
		if (!f.getParentFile().exists())
			f.getParentFile().mkdirs();
	}

	public static String reqFilePathFromURL(String path) {
		try {
			URL url = new URL(path);
			File f;
			try {
				f = new File(url.getPath());
			} catch (Exception e) {
				f = new File(url.toURI());
			}
			return f.getAbsolutePath();
		} catch (Exception e) {
			return path;
		}
	}

	public static String reqURLFromFilePath(String path) {
		try {
			// System.out.println(path);
			//File f = new File(path);
			URL url = new URL(path);
			// System.out.println(url.toString());
			return url.toString();
		} catch (Exception e) {
			return path;
		}
	}

	public static String reqURLFromFilePath(File path) {
		try {
			URL url = new URL(path.getAbsolutePath());
			return url.toString();
		} catch (Exception e) {
			return path.getAbsolutePath();
		}
	}

	public static List<File> reqFileList(String path,	boolean getSubFolder) {
		return reqFileList(new File(path), getSubFolder);
	}

	public static List<File> reqFileList(File path, boolean getSubFolder) {
		List<File> list = new ArrayList<File>();
		if (path.isFile()) {
			list.add(path);			
		}else if (path.isDirectory()) {
			File[] temp = path.listFiles();
			for (int i = 0; i < temp.length; i++)
				if (temp[i].isFile()) {
					list.add(temp[i]);
				} else {
					if (getSubFolder)
						list.addAll(reqFileList(temp[i], getSubFolder));
				}	
		}
		return list;
	}

	public static List<String> reqSubDirList(String path) {
		List<String> list = new ArrayList<String>();
		File fPath = new File(path);

		if (fPath.isDirectory()) {			
			File[] temp = fPath.listFiles();
			for (File f: temp)
				if (f.isDirectory())
					list.add(f.getName());				
		}
		return list;
	}
	public static List<File> reqSubDirList(File path) {
		List<File> list = new ArrayList<File>();	

		if (path.isDirectory()) {			
			File[] temp = path.listFiles();
			for (File f: temp)
				if (f.isDirectory())
					list.add(f);				
		}
		return list;
	}

	public static List<String> reqURLList(String path, String extension,	boolean getSubFolder) {
		path = FileTool.reqFilePathFromURL(path);
		List<File> listFiles = reqFileList(new File(path), extension,
				getSubFolder);
		List<String> listURL = new ArrayList<String>();
		for (int i = 0; i < listFiles.size(); i++) {
			listURL.add(reqURLFromFilePath(listFiles.get(i)));
		}

		return listURL;
	}

	public static List<String> reqFilenameList(String path,	String extension, boolean getSubFolder) {
		path = FileTool.reqFilePathFromURL(path);
		List<File> listFiles = reqFileList(new File(path), extension,
				getSubFolder);
		List<String> listNames = new ArrayList<String>();
		for (int i = 0; i < listFiles.size(); i++) {
			listNames.add(listFiles.get(i).getName());
		}

		return listNames;
	}

	public static List<File> reqFileList(String path, String extension,boolean getSubFolder) {
		path = FileTool.reqFilePathFromURL(path);
		return reqFileList(new File(path), extension, getSubFolder);
	}

	public static String reqFileExtension(String fileName){		
		int dotPos = fileName.lastIndexOf(".");
		String ext = fileName.substring(dotPos + 1);
		return  (ext.toLowerCase()) ;
	}

	public static String reqFileExtension(File file){	
		String fileName = file.getAbsolutePath();		
		return  reqFileExtension (fileName) ;
	}

	public static List<File> reqFileList(File path, String extension,	boolean getSubFolder) {
		List<File> list = new ArrayList<File>();

		if (path.isFile()) {
			String fileName = path.getAbsolutePath();
			int dotPos = fileName.lastIndexOf(".");
			String ext = fileName.substring(dotPos + 1);
			if (ext.toLowerCase().equals(extension.toLowerCase()))
				list.add(path);
		} else if (path.isDirectory()) {
			File[] temp = path.listFiles();
			for (int i = 0; i < temp.length; i++)
				if (temp[i].isFile()) {
					String fileName = temp[i].getAbsolutePath();
					int dotPos = fileName.lastIndexOf(".");
					String ext = fileName.substring(dotPos + 1);
					if (ext.toLowerCase().equals(extension.toLowerCase()))
						list.add(temp[i]);
				} else {
					if (getSubFolder)
						list.addAll(reqFileList(temp[i], extension,
								getSubFolder));
				}
		}
		return list;
	}

	public static List<File> reqDirList(File path, boolean getSubFolder) {
		List<File> list = new ArrayList<File>();
		if (path.isFile()) {

		} else if (path.isDirectory()) {
			list.add(path);
			File[] temp = path.listFiles();
			for (int i = 0; i < temp.length; i++)
				if (temp[i].isFile()) {

				} else {
					if (getSubFolder)
						list.addAll(reqDirList(temp[i],	getSubFolder));
				}
		}
		return list;
	}


	public static boolean canNewFile(String path, long dSize){
		try {
			RandomAccessFile f = new RandomAccessFile(path, "rw");
			f.setLength(dSize);
			f.seek(dSize-1);
			f.write((byte)0);
			f.close();
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	public static boolean canNewDir(String path) {
		if (path==null||path.length()==0) return false;
		File f = new File(path);
		if (f.exists()) return true;
		return f.mkdirs();
	}
	public static boolean canNewDir(File path) {
		if (path.exists()) return true;
		return path.mkdirs();
	}

	public static boolean canNewDirParent(String path) {
		if (path==null||path.length()==0) return false;
		File f = new File(path);
		if (f.getParentFile().exists()) return true;
		return f.getParentFile().mkdirs();
	}

	public static boolean canCopyFile(String source, String destination) { 
		File fsource 		= new File(source);
		File fdestination	= new File(destination);
		return canCopyFile(fsource, fdestination);
	}
	public static boolean canCopyFile(File source, String destination) { 		
		File fdestination	= new File(destination);
		return canCopyFile(source, fdestination);
	}
	public static boolean canCopyFile(File source, File destination) { 
		boolean resultat = false;

		// Declaration des flux
		java.io.FileInputStream sourceFile = null;
		java.io.FileOutputStream destinationFile = null;
		try {
			// Cr�ation du fichier :
			//destination.createNewFile();
			// Ouverture des flux
			sourceFile 		= new java.io.FileInputStream(source);
			destinationFile = new java.io.FileOutputStream(destination);
			// Lecture par segment de 0.5Mo
			byte buffer[] = new byte[512 * 1024];
			int nbLecture;
			while ((nbLecture = sourceFile.read(buffer)) != -1) {
				destinationFile.write(buffer, 0, nbLecture);
			}
			resultat = true;
		} catch (java.io.FileNotFoundException f) {
		} catch (java.io.IOException e) {
		} finally {
			// Quoi qu'il arrive, on ferme les flux
			try {
				sourceFile.close();
			} catch (Exception e) {
			}
			try {
				destinationFile.close();
			} catch (Exception e) {
			}
		}
		return (resultat);
	}

	public static int[] reqCopyDir(File dirSource, String desPath, boolean withSubDir) { 
		int[] count = {0,0};

		if (!canNewDir (desPath)) return count;		

		List<File> files 	= reqFileList(dirSource, false);

		// copy files
		for (File f: files){
			String fname = f.getName();
			if (canCopyFile(f, desPath+File.separator+fname)){
				count[1]++;
			}			
		}

		//copy subDir
		if (withSubDir){
			List<File> dirs		= reqSubDirList(dirSource); 
			for (File f: dirs){
				String fname = f.getName();
				doCopyDir (f, desPath + File.separator+fname, count);
			}
		}

		return count;
	}

	//nb of file/folder copy
	public static int[] reqCopyDir(File dirSource, File dirDest, boolean withSubDir) { 		
		String desPath = dirDest.getAbsolutePath();
		return reqCopyDir(dirSource, desPath, withSubDir);		
	}

	public static int[] reqCopyDir(String dirSource, String dirDest, boolean withSubDir) { 
		return reqCopyDir(new File(dirSource), dirDest, withSubDir);
	}

	//use only for subdir
	private static void doCopyDir(File dirSource, String dirDestination, int[] count) { 
		System.out.println("--copy dir: "+ dirSource.getAbsolutePath()+" => " + dirDestination);
		if (!canNewDir (dirDestination)) return;

		count[0]++;
		List<File> files 	= reqFileList	(dirSource, false);
		List<File> dirs		= reqSubDirList	(dirSource); 
		for (File f: files){
			String fname = f.getName();

			if (canCopyFile(f, dirDestination+File.separator+fname)){
				count[1]++;
			}

		}
		for (File f: dirs){
			String fname = f.getName();
			doCopyDir (f, dirDestination + File.separator+fname, count);
		}	
	}


	public static String reqParentName(File f){
		String s = f.getParent();
		s = s.substring(s.lastIndexOf(File.separatorChar)+1);
		//s = s.replaceAll(File.separatorChar+"", "");
		return s;
	}
	public static List<File> reqFileListAll(File path, boolean getSubFolder) {			
		List<File> list = new ArrayList<File>();
		if (path==null) return list;
		//list.add(path);
		if (path.isDirectory()) {
			File[] temp = path.listFiles();
			if (temp != null) {
				for (File f : temp) {// int i = 0; i < temp.length; i++) {
					list.add(f);
					if (f.isDirectory() && getSubFolder) {						
						list.addAll(reqFileListAll(f, getSubFolder));
					}
				}
			}
		}
		return list;
	}
	public static List<String> reqFileListAll(String path, boolean getSubFolder) {
		List<File> 		list 	= reqFileListAll(new File(path),getSubFolder);		
		List<String> 	listF 	= new ArrayList<String>();

		for (File f: list){
			listF.add(f.getAbsolutePath());
		}
		return listF;
	}

	public static File[] reqSubFileList(File path) {		
		if (path==null|| !path.exists()) return null;
		//list.add(path);
		if (path.isDirectory()) {			
			return path.listFiles();
		}
		return null;
	}

	private static void reqFileArray(File path, boolean getSubFolder, List<File[]> list) {		
		if (path.isDirectory()) {
			File[] temp = path.listFiles();		
			if (temp != null) {
				list.add(temp);
				for (File f : temp) {					
					if (f.isDirectory() && getSubFolder) {						
						reqFileArray(f, getSubFolder,list);
					}
				}
			}
		}		
	}

	private static void getFileArrayFrom_2(File path, boolean getSubFolder, List<File[]> list) {		
		List<File> toDo = new ArrayList<File>();
		toDo.add(path);
		if (!path.isDirectory()) return;
		File check;
		while (toDo.size() != 0) {		
			check = toDo.remove(0);
			//System.out.println(check.getName());
			File[] temp = check.listFiles();
			if (temp != null) {
				list.add(temp);
				for (File f : temp) {
					if (f.isDirectory() && getSubFolder) {
						toDo.add(f);
					}
				}
			}

		}

	}

	public static File[] reqFileArray(File path, boolean getSubFolder){
		List<File[]> list = new ArrayList<File[]>();
		reqFileArray(path,getSubFolder,list);
		int len =1;
		for (File[] a: list){
			len+=a.length;
		}
		File[] array = new File[len];
		array[0] = path;
		int pos =1;
		for (File[] a: list){
			System.arraycopy(a, 0, array, pos, a.length); 
			pos+=a.length;
		}
		return array;
	}
	public static File[] reqFileArray(String path, boolean getSubFolder){
		File f = new File(path);
		return reqFileArray(f,getSubFolder);
	}

	public static List<File[]> reqFileArrayList(File path, boolean getSubFolder){
		ArrayList<File[]> list = new ArrayList<File[]>();
		File[] array = new File[1];
		list.add(array);
		getFileArrayFrom_2(path,getSubFolder,list);

		return list;
	}
	public static  List<File[]> reqFileArrayList(String path, boolean getSubFolder){
		File f = new File(path);
		return reqFileArrayList(f,getSubFolder);
	}

	/*public static File[] getListFilesAndFolderFromF(File path, boolean getSubFolder) {
		File[] list = null ; //new ArrayList<File>();	
		//list.add(path);
		if (path.isDirectory() && getSubFolder) {
			File[] temp = path.listFiles();
			if (temp!= null){
				list 	= new File[temp.length+1];
				list[0] = path;
				for (int i = 0; i < temp.length; i++) {

					if (temp[i].isDirectory()) {
						list.addAll(getListFilesAndFolderFrom(temp[i],getSubFolder));
					}else list.add(temp[i]);
				}
			}
		}else{
			list = new File[1];
			list[0] = path;
		}
		return list;
	}*/


	/*
	public static void main(String[] s){
		String path = "d:\\";
		Date d1 = new Date();
		//File[] array = getFileArray(path, true);
		Date d2 = new Date();
		//getListFilesAndFolderFrom(path, true);
		Date d3 = new Date();
		getArrayListFileArray(path, true);
		Date d4 = new Date();
		if (CommonParam.IS_DEBUG) System.out.println(d2.getTime()-d1.getTime());
		if (CommonParam.IS_DEBUG) System.out.println(d3.getTime()-d2.getTime());
		if (CommonParam.IS_DEBUG) System.out.println(d4.getTime()-d3.getTime());

	}

	public static void test1(String[] a) {
		File f1 = new File("Ordinateur\\FinePix Z5fd\\xD Picture Card\\DCIM\\101_FUJI\\DSCF0466.JPG");
		File f2 = new File("c:\\test.jpg");
		File f3 = new File("FinePix Z5fd\\xD Picture Card\\DCIM");
		copier(f1,f2);
		ArrayList v = FileUtilities.getListFilesFrom(f3, false);

		System.out.println(convertFilePathToURL("D:\\Photo\\linhtinh"));
	}*/

	/*
	    public static void changeCreationDate(Path path,  FileTime fileTime  ) throws Exception {
	        // Step  -1: Access the file in Path object 
	       // Path path = Paths.get("C:", "test.xml");
	        // Get System time to set against created timestamp 
	        long time = System.currentTimeMillis();
	        // Get FileTime value 
	        //FileTime fileTime = FileTime.fromMillis(time);
	        // Change Created Time Stamp 
	        Files.setAttribute(path, "basic:creationTime", fileTime, NOFOLLOW_LINKS);                               
	    }
	 */


	public static long reqFileDateNew (String path) {		
		return reqFileDateNew(new File(path));
	}
	public static long reqFileDateNew (File file) {
		if (!file.exists()) return -1;
		Path filePath = file.toPath();
		BasicFileAttributes attributes = null;
		try{
			attributes =
					Files.readAttributes(filePath, BasicFileAttributes.class);
		}
		catch (IOException exception){
			System.out.println("Exception handled when trying to get file " +
					"attributes: " + exception.getMessage());
		}
		long milliseconds = attributes.creationTime().to(TimeUnit.MILLISECONDS);
		if((milliseconds > Long.MIN_VALUE) && (milliseconds < Long.MAX_VALUE)) {
			Date creationDate = new Date(attributes.creationTime().to(TimeUnit.MILLISECONDS));
			return creationDate.getTime();            
		}
		return 0;
	}

	public static long reqFileDateMod(String path){
		return reqFileDateMod(new File(path));
	}
	public static long reqFileDateMod(File f){		
		if (f.exists()) return f.lastModified();
		else return 0;
	}

	public static void doMoveFile(String fileName, String path, String newPath) throws Exception{
		File folder		= new File(newPath);
		
		if(!folder.exists()){
			folder.mkdirs();		
		}		
		Files.move(Paths.get(path+File.separator+fileName), Paths.get(newPath+File.separator+fileName));
	}
	public static void doMoveFile(String src, String dest) throws Exception{
		File folder		= new File(dest);
		
		if(!folder.getParentFile().exists()){
			folder.getParentFile().mkdirs();		
		}		
		Files.move(Paths.get(src), Paths.get(dest));
	}


	public static boolean canDelFile(String path){
		File f = new File(path);		
		return canDelFile(f, 1);	
	}


	private static boolean canDelFileSecu(File file) {
		try{
			if (file.exists() && file.isFile()) {
				SecureRandom random = new SecureRandom();
				RandomAccessFile raf = new RandomAccessFile(file, "rw");				
				long length = file.length();				
				raf.seek(0);				
				byte[] data = new byte[(int)Math.min(length, BUFFER_SIZE)];
				long pos = raf.getFilePointer();
				while (pos < length) {
					random.nextBytes(data);
					raf.write(data);
					pos += data.length;
				}
				raf.close();
				return file.delete();				

				/*
				FileChannel channel = raf.getChannel();
				MappedByteBuffer buffer = channel.map(FileChannel.MapMode.READ_WRITE, 0, raf.length());
				// overwrite with zeros
				while (buffer.hasRemaining()) {
					buffer.put((byte) 0);
				}
				buffer.force();
				buffer.rewind();
				// overwrite with ones
				while (buffer.hasRemaining()) {
					buffer.put((byte) 0xFF);
				}
				buffer.force();
				buffer.rewind();
				// overwrite with random data; one byte at a time
				byte[] data = new byte[1];
				while (buffer.hasRemaining()) {
					random.nextBytes(data);
					buffer.put(data[0]);
				}
				buffer.force();
				file.delete(); */
			}else return false;
		}catch(Exception e){
			return file.delete();
		}		
	}

	public static boolean canDelFile(File file, int levelSecur) {
		try{
			if (file.exists() && file.isFile()) {

				if (levelSecur<=0){
					return file.delete();						
				}

				if (levelSecur==1 ){
					SecureRandom random = new SecureRandom();
					RandomAccessFile raf = new RandomAccessFile(file, "rw");				
					long length = file.length();				
					raf.seek(0);
					raf.getFilePointer();
					byte[] data = new byte[(int)Math.min(length, BUFFER_SIZE*10)];
					int pos = 0;
					while (pos < length) {
						if (levelSecur>1) random.nextBytes(data);						
						raf.write(data);
						pos += data.length;
					}
					raf.close();
					return file.delete();					
				}else{
					return canDelFileSecu(file);
				}
				/*
				FileChannel channel = raf.getChannel();
				MappedByteBuffer buffer = channel.map(FileChannel.MapMode.READ_WRITE, 0, raf.length());
				// overwrite with zeros
				while (buffer.hasRemaining()) {
					buffer.put((byte) 0);
				}
				buffer.force();
				buffer.rewind();
				// overwrite with ones
				while (buffer.hasRemaining()) {
					buffer.put((byte) 0xFF);
				}
				buffer.force();
				buffer.rewind();
				// overwrite with random data; one byte at a time
				byte[] data = new byte[1];
				while (buffer.hasRemaining()) {
					random.nextBytes(data);
					buffer.put(data[0]);
				}
				buffer.force();
				file.delete(); */
			}else return false;
		}catch(Exception e){
			file.delete();
		}
		return true;
	}


	public static boolean canDelDir(String path) {
		File f = new File(path);
		return canDelDir(f);
	}

	public static boolean canDelFastDir(String path) {
		File f = new File(path);
		return canDelDir(f,0);
	}

	public static boolean canDelDirContent(String path) {
		File f = new File(path);
		boolean ok = true;
		if (f.exists()) {
			if (f.isDirectory()) {	

				for (File fT:f.listFiles()) {
					if (!fT.isDirectory()) {
						ok = ok && canDelFile(fT,1); //chi marcher voi file, dir khong dung duoc
					} else {
						ok= ok && canDelDir(fT); // supprimer sous repertoire
					}
				}
			}			
		}	
		return ok;
	}

	public static boolean canDelDirContent(String path, int levelSecur) {
		File f = new File(path);
		boolean ok = true;
		if (f.exists()) {
			if (f.isDirectory()) {	

				for (File fT:f.listFiles()) {
					if (!fT.isDirectory()) {
						ok = ok && canDelFile(fT, levelSecur); //chi marcher voi file, dir khong dung duoc
					} else {
						ok= ok && canDelDir(fT, levelSecur); // supprimer sous repertoire
					}
				}
			}			
		}	
		return ok;
	}


	public static boolean canDelDir(File path) { //thu muc rong moi xoa duoc
		if (path.exists()) {
			if (path.isDirectory()) {
				for (File fT:path.listFiles()) {
					if (!fT.isDirectory()) {
						canDelFile(fT,1); //fT.delete(); //chi marcher voi file, dir khong dung duoc
					} else {
						try{
							canDelDir(fT); // supprimer sous repertoire
						}catch(Exception e){}
					}
				}	
				return path.delete();
			}else return canDelFile(path,1);			
		}
		return true;
	}

	public static boolean canDelDir(File path, int levelSecur) { //thu muc rong moi xoa duoc
		if (path.exists()) {
			if (path.isDirectory()) {
				for (File fT:path.listFiles()) {
					if (!fT.isDirectory()) {
						canDelFile(fT, levelSecur); //fT.delete(); //chi marcher voi file, dir khong dung duoc
					} else {
						try{
							canDelDir(fT, levelSecur); // supprimer sous repertoire
						}catch(Exception e){}
					}
				}	
				return path.delete();
			}else return canDelFile(path, levelSecur);			
		}
		return true;
	}


	public static long reqDriverSpace(String path){
		File f = new File(path);
		return f.getTotalSpace();
	}

	public static long reqDriverSpace(File f){	
		return f.getTotalSpace();
	}

	
	
	
	
	
	private static void test(String[]a)throws Exception{
		File f = new File("\\\\db207\\");
		System.out.println(f.getTotalSpace());
		System.out.println(f.getFreeSpace());

		NumberFormat nf = NumberFormat.getNumberInstance();
		for (Path root : FileSystems.getDefault().getRootDirectories())
		{
			System.out.print(root + ": ");

			try
			{
				FileStore store = Files.getFileStore(root);
				System.out.println("available=" + nf.format(store.getUsableSpace()) + ", total=" + nf.format(store.getTotalSpace()));
			}
			catch (FileSystemException e)
			{
				System.out.println("error querying space: " + e.toString());
			}
		}
	}

	private static void test2(String[] args) {

		FileSystemView fsv = FileSystemView.getFileSystemView();

		File[] drives = File.listRoots();
		if (drives != null && drives.length > 0) {
			for (File aDrive : drives) {
				System.out.println("Drive Letter: " + aDrive);
				System.out.println("\tType: " + fsv.getSystemTypeDescription(aDrive));
				System.out.println("\tTotal space: " + aDrive.getTotalSpace());
				System.out.println("\tFree space: " + aDrive.getFreeSpace());
				System.out.println();
			}
		}
	}

	private static void testCopyDir(){
		String p1 = "E:/EM/Livraison";
		String p2 = "C:/tmp/test";
		int[] count = reqCopyDir(p1, p2, true);
		System.out.println(count[0]+"  "+ count[1]);
	}
	public static void main_(String[]a)throws Exception{
		/*File f = new File("c:/HaxLogs.txt");
		System.out.println(f.getTotalSpace());
		System.out.println(f.getUsableSpace());
		System.out.println(f.getFreeSpace());

		canNewFile("f:/HaxLogs.txt", 1000000000);*/
		//testCopyDir();
		
		buildCache();
	}
	
	private static void buildCache(){
		Hashtable<Integer, List<Integer>> tab = new Hashtable<Integer, List<Integer>> ();
		
		for (int i = 1 ;i<1000000;i++){
			System.out.println(i);
			List<Integer> lst = new ArrayList<Integer>();
			for (int j=0;j<10000;j++){
				lst.add(j);
			}
			tab.put(i, lst);
		}
	}
	
	public static String reqPath(String filename, String dirMain, String ...dirSub){
		String path  = "";
		for (String s : dirSub){
			path = path + s + File.separatorChar;
		}
		path 		= path.replace(".", File.separator);	
		path 		= dirMain+ File.separator+ path + filename;
			
		File fout 	= new File(path);
		fout.getParentFile().mkdirs();
		return path;
	}

	
	
	
	public static void doShowToConsole(String path) throws Exception{
		BufferedReader br = new BufferedReader(new FileReader(path)) ;
		String line;
		Scanner in = new Scanner(System.in);
		String s = "c";
		int lineNum =0;
		do{
			
			s = in.next();
			
			int count = 0; int print = 0;
			while ((line = br.readLine()) != null && count <=100000) {
				lineNum++; if (lineNum%10000==0)System.out.println("--------------" + lineNum); 
				//System.out.println(line);
				if (line.startsWith("2018-12-04 00")){
					print = 1;
					
				}
				if (print==1){
					System.out.println(line);
					count++;
				}
				
			}
		}while (!s.toLowerCase().equals("q"));
		br.close();
	}
	
	public static void main( String[] s) throws Exception{
		doShowToConsole ("C:/Users/vu.hoang-ext/Desktop/catalina.out.bak");
	}
}
