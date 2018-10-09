package com.gdssoft.core.web.servlet;

/*
 * 捷达世软件（深圳）有限公司 OA办公自动管理系统   
 */
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.FileUtil;
import com.gdssoft.core.web.servlet.FileUploadServlet;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.system.FileAttachService;

/**
 * 文件上传类
 * 
 * @author 捷达世软件
 * 
 */
public class FileUploadServlet extends HttpServlet {

	private Log logger = LogFactory.getLog(FileUploadServlet.class);

	private ServletConfig servletConfig = null;

	private FileAttachService fileAttachService = (FileAttachService) AppUtil
			.getBean("fileAttachService");

	private String uploadPath = ""; // 上传文件的目录
	private String tempPath = ""; // 临时文件目录
	
	private String[] suffix = {"xlsx","doc","jpg","pdf","wps","ceb","cebx","txt","png","xlsb","tgz","xls","docx","rar","zip","ppt","pptx"};
	private String fileCat = "others";
	// 默认不进行上传文件大小的判断
	private String judgeSize = "no";

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		logger.info("fileCat:" + fileCat);
		logger.info("judgeSize:" + judgeSize);
		// 指定保存至某个目录,若提交时，指定了该参数值，则表示保存的操作　
		String filePath = "";
		String fileId = "";
        String fileType="";
		req.setCharacterEncoding("UTF-8");
		resp.setCharacterEncoding("UTF-8");
		try {

			DiskFileItemFactory factory = new DiskFileItemFactory();
			// 缓存大小
			factory.setSizeThreshold(4096);
			factory.setRepository(new File(tempPath));
			ServletFileUpload fu = new ServletFileUpload(factory);

			List<FileItem> fileItems = fu.parseRequest(req);
			// 取得相关参数值
			boolean verify=false;
			for (FileItem fi : fileItems) {
				//格式验证	// 返回文件名及路径及fileId.
				String path = fi.getName();
				// 原文件名
				if(path!=null&&path!=""&&path!="null"){
					int dotIndex = path.lastIndexOf(".");
					String fileName1 =path.substring(dotIndex + 1);
					fileType=fileName1;
					if (fileName1 != null) {
						for(int i=0;i<suffix.length;i++){
							if(fileName1.toLowerCase().equals(suffix[i])){
								verify=true;
							}
						}
					}
					if(!verify){
						StringBuffer sb = new StringBuffer("{success:false,message:'暂不支持该格式！！！'}");
						resp.setContentType("text/html;charset=UTF-8");
						PrintWriter writer = resp.getWriter();
						writer.println(sb.toString());
						break;
					}
				}
				if ("file_cat".equals(fi.getFieldName())) {
					fileCat = fi.getString();
					// break;
				}
				if ("file_path".equals(fi.getFieldName())) {
					filePath = fi.getString();
				}
				if ("fileId".equals(fi.getFieldName())) {
					fileId = fi.getString();
				}
				if ("judge_size".equals(fi.getFieldName())) {
					judgeSize = fi.getString();
				}
			}
			if(verify){
			if (fileCat.indexOf(ContextUtil.getCurrentUser().getOwnerSchema()
					.toLowerCase()) != -1)
				fileCat = fileCat.replace("/"
						+ ContextUtil.getCurrentUser().getOwnerSchema()
								.toLowerCase(), "");
			logger.info("fileId:" + fileId);
			Iterator i = fileItems.iterator();
			// 目前处理每次只上传一个文件
			while (i.hasNext()) {

				FileItem fi = (FileItem) i.next();

				if (fi.getContentType() == null) {
					continue;
				}

				// 返回文件名及路径及fileId.
				String path = fi.getName();

				int start = path.lastIndexOf("\\");

				// 原文件名
				String fileName = path.substring(start + 1);

				String relativeFullPath = null;

				if (!"".equals(filePath)) {
					relativeFullPath = filePath;
				} else if (!"".equals(fileId)) {
					FileAttach fileAttach = fileAttachService.get(new Long(
							fileId));
					relativeFullPath = fileAttach.getFilePath();
					logger.info("exist filePath:" + relativeFullPath);
				} else {
					relativeFullPath = ContextUtil.getCurrentUser()
							.getOwnerSchema().toLowerCase()
							+ "/"
							+ fileCat
							+ "/"
							+ FileUtil.generateFilename(fileName);
				}
				int index = relativeFullPath.lastIndexOf("/");

				File dirPath = new File(uploadPath + "/"
						+ relativeFullPath.substring(0, index + 1));

				if (!dirPath.exists()) {
					dirPath.mkdirs();
				}
				logger.info("fileSize:" + fi.getSize());
				// 判读三是否进行大小判断
				if (this.judgeSize.equals("yes")) {
					if (fi.getSize() > 1024 * 1024 * 5) {
						System.out.println(fi.getFieldName());
						System.out.println(fi.getName());
						StringBuffer sb = new StringBuffer("{success:false");
						sb.append(",fileId:").append(new Long(000))
								.append(",fileName:'").append("test")
								.append("',filePath:'").append("")
								.append("',message:'文件大小大于5M'");
						sb.append("}");
						resp.setContentType("text/html;charset=UTF-8");
						PrintWriter writer = resp.getWriter();

						logger.info("url:");

						writer.println(sb.toString());
						break;
					} else {
						AppUser appUser = ContextUtil.getCurrentUser();
						BigDecimal capacity = appUser.getCapacity();
						// 取得用户已经使用的空间大小
						BigDecimal inUseCapacity = appUser.getInUseCapacity();
						// 计算剩余空间大小
						BigDecimal laveCapacity = capacity.subtract(
								inUseCapacity).multiply(new BigDecimal(1024));
						System.out.println("----laveCapacity" + laveCapacity);
						System.out.println("----fi.getSize():" + fi.getSize());

						if (laveCapacity.compareTo(BigDecimal.valueOf(fi
								.getSize())) < 0) {
							StringBuffer sb = new StringBuffer("{success:false");
							sb.append(",fileId:").append(new Long(000))
									.append(",fileName:'").append("test")
									.append("',filePath:'").append("")
									.append("',message:'空间不足'");
							sb.append("}");
							resp.setContentType("text/html;charset=UTF-8");
							PrintWriter writer = resp.getWriter();

							logger.info("url:");

							writer.println(sb.toString());
							break;

						}
					}

				}

				fi.write(new File(uploadPath + "/" + relativeFullPath));
				FileAttach file = null;

				//ceb转pdf
                if(fileType!=null&&fileType.toLowerCase().equals("ceb")){
                	String url = "http://localhost:8070/fileServes/api/cebToPdf.do?path="+relativeFullPath;
                    try {
                        URL oracle = new URL(url);
                        URLConnection yc = oracle.openConnection();
                        yc.getInputStream();
                    } catch (MalformedURLException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    relativeFullPath=relativeFullPath.substring(0,relativeFullPath.lastIndexOf("."))+".pdf";
                    fileName=fileName.substring(0,fileName.lastIndexOf("."))+".pdf";
                }
				if (!"".equals(filePath)) {
					file = fileAttachService.getByPath(filePath);
					file.setNote(getStrFileSize(fi.getSize()));
					file.setTotalBytes(new Double(fi.getSize()));
					fileAttachService.save(file);
				}

				if (!"".equals(fileId)) {
					file = fileAttachService.get(new Long(fileId));
					file.setTotalBytes(new Double(fi.getSize()));
					file.setNote(getStrFileSize(fi.getSize()));
					fileAttachService.save(file);
				}

				if (file == null) {
					file = new FileAttach();
					file.setCreatetime(new Date());
					AppUser curUser = ContextUtil.getCurrentUser();
					if (curUser != null) {
						file.setCreator(curUser.getFullname());
					} else {
						file.setCreator("UNKown");
					}
					int dotIndex = fileName.lastIndexOf(".");
					file.setExt(fileName.substring(dotIndex + 1));
					file.setFileName(fileName);
					file.setFilePath(relativeFullPath);
					file.setFileType(fileCat);
					file.setIsMe(0l);
					file.setTotalBytes(new Double(fi.getSize()));
					file.setNote(getStrFileSize(fi.getSize()));
					fileAttachService.save(file);
				}

				StringBuffer sb = new StringBuffer("{success:true");
				sb.append(",fileId:")
						.append(file.getFileId())
						.append(",fileName:'")
						.append(file.getFileName())
						.append("',filePath:'")
						.append(file.getFilePath())
						.append("',message:'upload file success.("
								+ fi.getSize() + " bytes)'");
				sb.append("}");
				resp.setContentType("text/html;charset=UTF-8");
				PrintWriter writer = resp.getWriter();

				logger.info("url:");

				writer.println(sb.toString());
			}
		}
		} catch (Exception e) {
			resp.getWriter().write(
					"{'success':false,'message':'error..." + e.getMessage()
							+ "'}");
		}
	}

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		this.servletConfig = config;
	}

	public void init() throws ServletException {

		// 初始化上传的路径及临时文件路径

		uploadPath = getServletContext().getRealPath("/attachFiles/");

		File uploadPathFile = new File(uploadPath);
		if (!uploadPathFile.exists()) {
			uploadPathFile.mkdirs();
		}
		tempPath = uploadPath + "/temp";

		File tempPathFile = new File(tempPath);
		if (!tempPathFile.exists()) {
			tempPathFile.mkdirs();
		}
	}

	/*------------------------------------------------------------
	保存文档到服务器磁盘，返回值true，保存成功，返回值为false时，保存失败。
	--------------------------------------------------------------*/
	public boolean saveFileToDisk(String officefileNameDisk) {
		File officeFileUpload = null;
		FileItem officeFileItem = null;

		boolean result = true;
		try {
			if (!"".equalsIgnoreCase(officefileNameDisk)
					&& officeFileItem != null) {
				officeFileUpload = new File(uploadPath + officefileNameDisk);
				officeFileItem.write(officeFileUpload);
			}
		} catch (FileNotFoundException e) {

		} catch (Exception e) {
			e.printStackTrace();
			result = false;
		}
		return result;
	}

	private String getStrFileSize(double size) {
		DecimalFormat df = new DecimalFormat("0.00");
		if (size > 1024 * 1024) {
			double ss = size / (1024 * 1024);
			return df.format(ss) + " M";
		} else if (size > 1024) {
			double ss = size / 1024;
			return df.format(ss) + " KB";
		} else {
			return size + " bytes";
		}
	}

}
