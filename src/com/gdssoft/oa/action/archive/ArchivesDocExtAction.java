package com.gdssoft.oa.action.archive;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.jfree.util.Log;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.ArchivesDocExt;
import com.gdssoft.oa.model.archive.DocExtHistory;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.ArchivesDocExtService;
import com.gdssoft.oa.service.archive.DocExtHistoryService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class ArchivesDocExtAction extends BaseAction {
	@Resource
	private ArchivesDocExtService archivesDocExtService;
	@Resource
	private DocExtHistoryService docExtHistoryService;
	@Resource
	private FileAttachService fileAttachService;
	private ArchivesDocExt archivesDocExt;

	private Long docId;

	public Long getDocId() {
		return docId;
	}

	public void setDocId(Long docId) {
		this.docId = docId;
	}

	public ArchivesDocExt getArchivesDocExt() {
		return archivesDocExt;
	}

	public void setArchivesDocExt(ArchivesDocExt archivesDoc) {
		this.archivesDocExt = archivesDoc;
	}

	/**
	 * 显示列表
	 */
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());
		String archivesId = getRequest().getParameter("archivesId");
		String docType = getRequest().getParameter("docType");
		if (archivesId != null && !"".equals(archivesId)) {
			filter.addFilter("Q_archives.archivesId_L_EQ", archivesId);
		}
		if (docType != null && !"".equals(docType)) {
			filter.addFilter("Q_docType_N_EQ", docType);
		}
		List<ArchivesDocExt> list = archivesDocExtService.getAll(filter);
		Type type = new TypeToken<List<ArchivesDocExt>>() {
		}.getType();
	/*	StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");*/
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":")
		.append(filter.getPagingBean().getTotalItems()).append(
				",\"result\":");

		// Gson gson=new
		// GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		JSONSerializer json = JsonUtil.getJSONSerializer("createtime",
				"updatetime", "fileAttach.createtime");
		buff.append(json.serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				archivesDocExtService.remove(new Long(id));
			}
		}

		jsonString = "{success:true}";

		return SUCCESS;
	}

	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String get() {
		ArchivesDocExt archivesDoc = archivesDocExtService.get(docId);

		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.create();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(archivesDoc));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		AppUser curUser = ContextUtil.getCurrentUser();
		if (archivesDocExt.getDocId() == null||archivesDocExt.getDocId() ==0) {
			// 新增版本
			archivesDocExt.setDocId(null);
			archivesDocExt.initUsers(curUser);
			archivesDocExt.setDocStatus(ArchivesDocExt.STATUS_MODIFY);
			archivesDocExt.setUpdatetime(new Date());
			archivesDocExt.setCreatetime(new Date());
			archivesDocExt.setCurVersion(ArchivesDocExt.ORI_VERSION);
			archivesDocExt.setFileAttach(fileAttachService.getByPath(archivesDocExt
					.getDocPath()));
			archivesDocExtService.save(archivesDocExt);
		} else {
			// 修改版本
			ArchivesDocExt oldVersion = archivesDocExtService.get(archivesDocExt
					.getDocId());
			archivesDocExt.setCreatetime(oldVersion.getCreatetime());
			archivesDocExt.setArchives(oldVersion.getArchives());
			archivesDocExt.setCreatorId(oldVersion.getCreatorId());
			archivesDocExt.setFileAttach(fileAttachService.getByPath(archivesDocExt
					.getDocPath()));
			archivesDocExt.setCreator(oldVersion.getCreator());
			archivesDocExt.setDocStatus(ArchivesDocExt.STATUS_MODIFY);
			archivesDocExt.setUpdatetime(new Date());
			archivesDocExt.setCurVersion(oldVersion.getCurVersion() + 1);
			archivesDocExt.setMender(curUser.getFullname());
			archivesDocExt.setMenderId(curUser.getUserId());
			archivesDocExt.setDocHistorys(oldVersion.getDocHistorys());
			archivesDocExt.setFileAttach(fileAttachService.getByPath(archivesDocExt
					.getDocPath()));
			archivesDocExtService.merge(archivesDocExt);

		}
		// 历史版本
		DocExtHistory docExtHistory = new DocExtHistory();
		docExtHistory.setArchivesDocExt(archivesDocExt);
		docExtHistory.setFileAttach(fileAttachService.getByPath(archivesDocExt
				.getDocPath()));
		docExtHistory.setDocName(archivesDocExt.getDocName());
		docExtHistory.setPath(archivesDocExt.getDocPath());
		docExtHistory.setVersion(archivesDocExt.getCurVersion());
		docExtHistory.setUpdatetime(new Date());
		docExtHistory.setMender(curUser.getFullname());
		docExtHistoryService.save(docExtHistory);

		// 保存成功后返回版本JSON数据
		// Archives archives = archivesDoc.getArchives();
		// Set<ArchivesDoc> docSet = archives.getArchivesDocs();
		StringBuffer buff = new StringBuffer("{success:true,data:");
		// Gson gson = new
		// GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		JSONSerializer json = new JSONSerializer();
		buff.append(json.exclude(new String[] { "class", "docHistorys" })
				.serialize(archivesDocExt));
		// buff.append(gson.toJson(docSet));
		buff.append("}");

		setJsonString(buff.toString());
		return SUCCESS;
	}

	public String copy() {
		String historyId = getRequest().getParameter("historyId");
		DocExtHistory docExtHistory = docExtHistoryService.get(new Long(historyId));
		DocExtHistory newExtHistory = new DocExtHistory();

		archivesDocExt = docExtHistory.getArchivesDocExt();

		newExtHistory.setDocName(docExtHistory.getDocName());
		newExtHistory.setFileAttach(docExtHistory.getFileAttach());
		// newHistory.setFileId(docHistory.getFileId());
		newExtHistory.setMender(ContextUtil.getCurrentUser().getFullname());
		newExtHistory.setPath(docExtHistory.getPath());
		newExtHistory.setUpdatetime(new Date());
		newExtHistory.setVersion(archivesDocExt.getCurVersion() + 1);
		newExtHistory.setArchivesDocExt(archivesDocExt);
		docExtHistoryService.save(newExtHistory);

		archivesDocExt.setCurVersion(newExtHistory.getVersion());
		archivesDocExt.setDocPath(newExtHistory.getPath());
		archivesDocExt.setFileAttach(newExtHistory.getFileAttach());

		archivesDocExtService.save(archivesDocExt);

		StringBuffer buff = new StringBuffer("{success:true,data:");
		JSONSerializer json = new JSONSerializer();
		buff.append(json.exclude(new String[] { "class", "docHistorys" })
				.serialize(archivesDocExt));
		buff.append("}");

		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	/**
	 * 公文正文是否是最终版本
	 */
	public String finish(){
		String docId = getRequest().getParameter("docId");
		if(docId!=null&&StringUtils.isNotEmpty(docId)){
			ArchivesDocExt archivesDoc = archivesDocExtService.get(new Long(docId));
			archivesDoc.setIsFinish((short) 1);
			archivesDocExtService.save(archivesDoc);
		}
		return SUCCESS;
	}
	

}
