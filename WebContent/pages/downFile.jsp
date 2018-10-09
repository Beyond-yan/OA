<%@page import="java.net.URLDecoder"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.model.system.FileAttach"%>
<%@page import="com.gdssoft.oa.model.system.SysArchivesFiles"%>
<%@page import="com.gdssoft.oa.service.system.FileAttachService"%>
<%@page import="com.gdssoft.oa.service.system.SysArchivesFilesService"%>
<%@page import="com.gdssoft.oa.model.system.SysArchivesFilesHis"%>
<%@page import="com.gdssoft.oa.service.system.SysArchivesFilesHisService"%>
<%@page language="java" contentType="application/x-msdownload" pageEncoding="UTF-8"%><%
      //关于文件下载时采用文件流输出的方式处理：
	 
      FileAttachService fileAttachService = (FileAttachService) AppUtil
			.getBean("fileAttachService");
	SysArchivesFilesService sysArchivesFilesService = (SysArchivesFilesService)AppUtil.getBean("sysArchivesFilesService");
	SysArchivesFilesHisService sysArchivesFilesHisService = (SysArchivesFilesHisService)AppUtil.getBean("sysArchivesFilesHisService");
	  String fileId = request.getParameter("fileId");
	  String id = request.getParameter("id");
	  String hisId = request.getParameter("hisId");
	  String fPath = null;
	  String filePath = null;
	  String fileName = null;
	  if(null != fileId && "" != fileId){
		  FileAttach fileAttach=fileAttachService.get(new Long(fileId));
	      //String fileName = request.getParameter("fname"); 
	       //fileName =URLDecoder.decode(fileName, "UTF-8");
		  //String fPath = request.getParameter("fpath");
	      //String filePath = request.getRealPath(fPath);
	      fPath ="attachFiles/"+fileAttach.getFilePath();
	      filePath = request.getRealPath(fPath);
	      fileName =fileAttach.getFileName();
	  }else if(null != id && "" != id){
		  SysArchivesFiles sysArchivesFiles=sysArchivesFilesService.get(new Long(id));
	      fPath ="attachFiles/"+sysArchivesFiles.getFilePath();
	      filePath = request.getRealPath(fPath);
	      fileName =sysArchivesFiles.getFileName();
	  }else{
		  SysArchivesFilesHis sysArchivesFilesHis=sysArchivesFilesHisService.get(new Long(hisId));
		  fPath ="attachFiles/"+sysArchivesFilesHis.getFilePath();
	      filePath = request.getRealPath(fPath);
	      fileName =sysArchivesFilesHis.getFileName();
	  }
      System.out.print(fileName);
      fileName=fileName.replaceAll(" ", ""); 
      fileName=new String(fileName.getBytes("GBK"),"ISO8859-1");
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
      response.addHeader("Content-Disposition","attachment;filename=\"" + fileName+"\"");

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
      }
%>