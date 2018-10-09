package com.gdssoft.oa.data;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

/**
 * Servlet implementation class FileDown
 * 
 * 下载IE和office插件
 */
public class FileDown extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public FileDown() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		String path = request.getParameter("path");
		System.out.println("--------path--------"+path);
		String pathStr=getServletContext().getRealPath("/")+path;
		System.out.println("--------pathStr--------"+pathStr);
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		// path是指欲下载的文件的路径。
		File file = new File(path);
		// 取得文件名。
		String filename = file.getName();
		System.out.println("--------filename---"+filename);
		if (StringUtils.isNotEmpty(filename)) {
			if (filename.toLowerCase().endsWith("zip")) {
				response.setContentType("application/x-zip-compressed");
			} else if (filename.toLowerCase().endsWith("rar")) {
				response.setContentType("application/octet-stream");
			} else if (filename.toLowerCase().endsWith("doc")) {
				response.setContentType("application/msword");
			} else if (filename.toLowerCase().endsWith("xls")
					|| filename.toLowerCase().endsWith("csv")) {
				response.setContentType("application/ms-excel ");

			} else if (filename.toLowerCase().endsWith("pdf")) {
				response.setContentType("application/pdf");
			} else {
				response.setContentType("application/x-msdownload");
			}

			ServletOutputStream out = null;
			try {

				java.io.FileInputStream fileIn = new java.io.FileInputStream(
						pathStr);

				response.setHeader("Content-Disposition",
						"attachment;filename="
								+ URLEncoder.encode(filename, "UTF-8"));

				out = response.getOutputStream();

				byte[] buff = new byte[1024];
				int leng = fileIn.read(buff);
				while (leng > 0) {
					out.write(buff, 0, leng);
					leng = fileIn.read(buff);
				}
			} catch (Exception ex) {
				ex.printStackTrace();
			} finally {
				if (out != null) {
					try {
						out.flush();
					} catch (IOException e) {
						e.printStackTrace();
					}
					try {
						out.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
