package com.gdssoft.oa.action.system;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import javax.annotation.Resource;

import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.lang.reflect.Type;

import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.system.FileAttachService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;


/**
 * 
 * @author csx
 * 
 */
public class FileAttachAction extends BaseAction {
	@Resource
	private FileAttachService fileAttachService;
	private FileAttach fileAttach;

	private Long fileId;

	private String filePath;

	public Long getFileId() {
		return fileId;
	}

	public void setFileId(Long fileId) {
		this.fileId = fileId;
	}

	public FileAttach getFileAttach() {
		return fileAttach;
	}

	public void setFileAttach(FileAttach fileAttach) {
		this.fileAttach = fileAttach;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	/**
	 * 查询我上传附件信息
	 */
	public String list() {
		Properties props = new FileAttachAction().readProperty();
		int start = new QueryFilter(getRequest()).getPagingBean().getStart();
		PagingBean pb = new PagingBean(start, 10);
		String imageOrOthersFile = getRequest().getParameter("type");
		boolean bo = true;// 默认file
		if (imageOrOthersFile != null
				&& imageOrOthersFile.toLowerCase().equals("image")) {
			bo = false; // 图片
			pb = new PagingBean(start, 8);
		}
		String fileType = getRequest().getParameter("Q_fileType_S_LK");
		if (fileType == null || fileType.equals(""))
			fileType = "";
		else {
			String ft = "";
			if (fileType.indexOf("/") > 0) {
				ft = fileType.substring(0, fileType.length() - 2);
				fileType = getPropertyValue(props, ft) + "/%";
			} else {
				ft = fileType.substring(0, fileType.length() - 1);
				fileType = getPropertyValue(props, ft) + "%";
			}
		}
		List<FileAttach> list = fileAttachService.fileList(pb, fileType, bo);
		return listToJson(list, pb);
	};

	public String listAll() {
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addSorted("fileType", "DESC");
		List<FileAttach> list = fileAttachService.getAll(filter);
		return listToJson(list, filter.getPagingBean());
	}

	/**
	 * 加载imageTree
	 */
	public String loadTree() {
		StringBuffer sb = new StringBuffer("[");
		List<FileAttach> fList = searchOneNodes();
		Properties props = new FileAttachAction().readProperty();
		for (int i = 0; i < fList.size(); i++) { // 一级
			String s = fList.get(i).getFileType();
			String fStr = "{id:'" + fList.get(i).getFileId() + "',text:'"
					+ getPropertyValue(props, s) + "'";
			// ##获取第二节点##//
			List<FileAttach> zList = searchTwoNodes(s);
			if (zList.size() > 0) { // 判断一级节点是否存在子节点
				fStr += ",children:[";
				for (int j = 0; j < zList.size(); j++) {
					String z = zList.get(j).getFileType();
					String zStr = "{id:'" + zList.get(j).getFileId()
							+ "',text:'" + getPropertyValue(props, z) + "'";
					// ##获取第三节点##//
					List<FileAttach> sList = searchThreeNodes(s + "/" + z);
					if (sList.size() > 0) { // 判断二级节点是否存在子节点
						zStr += ",children:[";
						for (int k = 0; k < sList.size(); k++) { // 三级节点
							String sz = sList.get(k).getFileType();
							String szStr = "{id:'" + sList.get(k).getFileId()
									+ "',text:'" + getPropertyValue(props, sz)
									+ "',leaf:true},";
							if (k == sList.size() - 1)
								szStr = szStr.substring(0, szStr.length() - 1);
							zStr += szStr;
						} // end of this k for
						zStr += "]},";
					} else {
						zStr += ",leaf:true},";
					}
					if (j == zList.size() - 1)
						zStr = zStr.substring(0, zStr.length() - 1);
					fStr += zStr;
				} // end of j for
				fStr += "]},";
			} else {
				fStr += ",leaf:true},";
			}
			if (i == fList.size() - 1)
				fStr = fStr.substring(0, fStr.length() - 1);
			sb.append(fStr);
		}// end of i for

		setJsonString(sb.append("]").toString());
		return SUCCESS;
	}

	/**
	 * 批量删除
	 */
	public String multiDel() {
		String ids = getRequest().getParameter("ids");
		if (ids != null) {
			for (String id : ids.split(",")) {
				fileAttachService.remove(new Long(id));
			}
		}
		jsonString = "{success:true}";
		return SUCCESS;
	}

	/**
	 * 显示详细信息
	 */
	public String get() {
		FileAttach fileAttach = fileAttachService.get(fileId);
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss")
				.create();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(fileAttach));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		fileAttachService.save(fileAttach);
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 根据附件的路径删除附件,用于重复上传图片,或删除图片,已用于员工管理模块
	 */
	public String delete() {
		fileAttachService.removeByPath(filePath);
		return SUCCESS;
	}

	/**
	 * @description 将List集合中的数据转化为JSON格式
	 * @param pb
	 *            PagingBean
	 */
	private String listToJson(List<FileAttach> list, PagingBean pb) {
		Type type = new TypeToken<List<FileAttach>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");
		Gson gson = new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	// ################TreeView加载节点操作方法##################//

	/**
	 * 加载一级节点
	 */
	private List<FileAttach> searchOneNodes() {
		List<FileAttach> list = fileAttachService.getAll();
		List<FileAttach> newList = new ArrayList<FileAttach>();
		// 第一.截取,第二.除掉重复数据
		Iterator<FileAttach> it = list.iterator();
		while (it.hasNext()) {
			FileAttach f = it.next();
			String fileType = f.getFileType();
			if (fileType.indexOf("/") > 0)
				f.setFileType(fileType.substring(0, fileType.indexOf("/")));
			else
				f.setFileType(fileType);
			if (newList.size() > 0) { // 去掉重复数据
				if (judgeDBRepeat(f.getFileType(), newList))
					newList.add(f);
			} else
				newList.add(f);
		}
		list.clear();
		return newList;
	}

	/**
	 * 判断List集合中是否存在重复数据，true:不重复
	 */
	private boolean judgeDBRepeat(String str, List<FileAttach> list) {
		boolean bo = true;
		Iterator<FileAttach> it = list.iterator();
		while (it.hasNext()) {
			FileAttach f = it.next();
			if (f.getFileType().equals(str))
				bo = false; // 重复
		}
		return bo;
	}

	/**
	 * 加载二级节点,参数：ft,父节点筛选文本
	 */
	private List<FileAttach> searchTwoNodes(String ft) {
		List<FileAttach> list = fileAttachService.fileList(ft + "/%");
		List<FileAttach> newList = new ArrayList<FileAttach>();
		// 第一.截取,第二.去掉重复
		Iterator<FileAttach> it = list.iterator();
		while (it.hasNext()) {
			FileAttach f = it.next();
			String fileType = f.getFileType();
			f.setFileType(fileType
					.substring(ft.length() + 1, fileType.length()));
			if (newList.size() > 0) {
				if (judgeDBRepeat(fileType, newList))
					newList.add(f);
			} else
				newList.add(f);
		}
		list.clear();
		return newList;
	}

	/**
	 * 加载三级节点，参数： ft.二级节点
	 */
	private List<FileAttach> searchThreeNodes(String ft) {
		List<FileAttach> list = fileAttachService.fileList(ft + "/");
		List<FileAttach> newList = new ArrayList<FileAttach>();
		// 第一.截取,第二.去掉重复
		Iterator<FileAttach> it = list.iterator();
		while (it.hasNext()) {
			FileAttach f = it.next();
			String fileType = f.getFileType();
			f.setFileType(fileType
					.substring(ft.length() + 1, fileType.length()));
			if (newList.size() > 0) {
				if (judgeDBRepeat(fileType, newList))
					newList.add(f);
			} else
				newList.add(f);
		}
		list.clear();
		return newList;
	}

	/**
	 * 读取properties文件
	 */
	private Properties readProperty() {
		Properties props = new Properties();
		String filePath = getSession().getServletContext().getRealPath(
				"/WEB-INF/classes");
		try {
			FileInputStream fis = new FileInputStream(filePath
					+ "/upload-directory.properties");
			Reader r = new InputStreamReader(fis, "UTF-8");
			props.load(r);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return props;
	}

	/**
	 * 根据key值从Properties对象中获取对应的Value值,如果没有匹配的数值，将返回key值
	 */
	private String getPropertyValue(Properties props, String s) {
		if (props.getProperty(s) == null)
			return s;
		else
			return props.getProperty(s);
	}
}
