<%@page import="java.net.URLDecoder"%>
<%@page language="java" contentType="application/x-msdownload" pageEncoding="UTF-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesDepService"%>
<%@page import="com.gdssoft.oa.model.archive.ArchivesDep"%>
<%@page import="com.gdssoft.oa.model.system.FileAttach"%>
<%@page import="com.gdssoft.oa.service.system.FileAttachService"%>
<%@page import="com.gdssoft.oa.service.system.SysArchivesFilesService"%>
<%@page import="com.gdssoft.oa.service.system.SysDataTransferService"%>
<%@page import="com.gdssoft.oa.model.system.SysArchivesFiles"%>
<%@page import="com.gdssoft.oa.model.system.SysDataTransfer"%>
<%
      //关于文件下载时采用文件流输出的方式处理：
      SysDataTransferService sdTransferService = (SysDataTransferService) AppUtil
			.getBean("sysDataTransferService");
	SysArchivesFilesService saFilesService = (SysArchivesFilesService) AppUtil
	 		.getBean("sysArchivesFilesService");
	  String fileId = request.getParameter("fileId");
	  SysArchivesFiles sysArchivesFiles=saFilesService.get(new Long(fileId));
      //String fileName = request.getParameter("fname");
      //fileName =URLDecoder.decode(fileName, "UTF-8");
	  //String fPath = request.getParameter("fpath");
      //String filePath = request.getRealPath(fPath);
      String fPath ="attachFiles/"+sysArchivesFiles.getFilePath();
      String filePath = request.getRealPath(fPath);
      String fileName =sysArchivesFiles.getFileName();
      fileName=new String(fileName.getBytes("GBK"),"ISO8859-1");
      String id = request.getParameter("id");
      //如果请求的文件不在附件文件夹则拒绝
      if(fPath.indexOf("attachFiles") != 0){
    	  out.println("拒绝访问");
    	  return;
      }
      
      if(request.getHeader("user-agent")!=null&&(request.getHeader("user-agent").toLowerCase().indexOf("android")>-1)){
    	  response.sendRedirect("../" + fPath );
    	  return;
      }
      
      response.reset();//可以加也可以不加
      response.setContentType("application/x-download");
      
      //fileName = java.net.URLEncoder.encode(fileName,"UTF-8");
      response.addHeader("content-type","application/x-msdownload");
      response.addHeader("Content-Disposition","attachment;filename=" + fileName);

      java.io.OutputStream outp = null;
      java.io.FileInputStream in = null;
      try
      {
          outp = response.getOutputStream();
          in = new java.io.FileInputStream(filePath);

          byte[] b = new byte[1024];
          int i = 0;                                                                                                                                                                                                                                                                                                                                                      
                                                                                    
          while((i = in.read(b)) > 0)
          {
              outp.write(b, 0, i);
          }                             
          outp.flush();                                                                              
      }
      catch(Exception e)
      {
          System.out.println("Error!");
          e.printStackTrace();
      }
      finally
      {
          if(in != null)
          {
              in.close();
              in = null;
          }
          if(outp != null)
          {
        	  out.clear();
        	  out=pageContext.pushBody();
              outp.close();
              outp = null;
          }
          sdTransferService.updateDownload(new Long(id));
      }
%>