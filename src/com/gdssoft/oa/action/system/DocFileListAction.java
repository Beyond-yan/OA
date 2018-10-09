package com.gdssoft.oa.action.system;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.lang.reflect.Type;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.system.DocFileList;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.system.DocFileListService;
import com.gdssoft.oa.service.system.DocFilesService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.google.gson.reflect.TypeToken;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author
 * 
 */
public class DocFileListAction extends BaseAction {
	
	@Resource
	private DocFileListService docFileListService;
	private DocFileList docFileList;
	@Resource
	private FileAttachService fileAttachService;

	private Long listId;

	public Long getListId() {
		return listId;
	}

	public void setListId(Long listId) {
		this.listId = listId;
	}

	public DocFileList getDocFileList() {
		return docFileList;
	}

	public void setDocFileList(DocFileList docFileList) {
		this.docFileList = docFileList;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		List<DocFileList> list = docFileListService.getAll(filter);

		Type type = new TypeToken<List<DocFileList>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		// Gson gson=new Gson();
		// buff.append(gson.toJson(list, type));
		JSONSerializer serializer = new JSONSerializer();
		serializer
				.exclude(new String[] { "rollFile", "fileAttach.createTime" })
				.transform(new DateTransformer("yyyy-MM-dd"),
						new String[] { "fileAttach.createTime", "createTime" });
		buff.append(serializer.serialize(list));

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
		if (ids != null && ids.length > 0) {
			for (String id : ids) {
				if (id != null && !id.equals("")) {
					docFileList = docFileListService.get(new Long(id));
					FileAttach fileAttach = docFileList.getFileAttach();
					
					docFileListService.remove(docFileList);
					fileAttachService.removeByPath(fileAttach.getFilePath());
				}
			}
		}
		String[] fileIds = getRequest().getParameterValues("fileIds");
		if (fileIds != null && fileIds.length > 0) {
			for (String id : fileIds) {
				if (id != null && !id.equals("")) {
					FileAttach fileAttach = fileAttachService.get(new Long(id));
					
					fileAttachService.removeByPath(fileAttach.getFilePath());
				}
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
		DocFileList docFileList = docFileListService.get(listId);

		// Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		// sb.append(gson.toJson(docFileList));
		JSONSerializer serializer = new JSONSerializer();
		serializer.exclude(new String[] { "rollFile" }).transform(
				new DateTransformer("yyyy-MM-dd"),
				new String[] { "fileAttach.createtime" });
		sb.append(serializer.serialize(docFileList));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		if (docFileList.getId() == null) {
			docFileListService.save(docFileList);
		} else {
			DocFileList orgDocFileList = docFileListService.get(docFileList
					.getId());
			try {
				BeanUtil.copyNotNullProperties(orgDocFileList, docFileList);
				docFileListService.save(orgDocFileList);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;

	}
}
