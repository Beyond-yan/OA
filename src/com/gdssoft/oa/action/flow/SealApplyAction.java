package com.gdssoft.oa.action.flow;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.lang.reflect.Type;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.flow.SealApply;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.flow.SealApplyService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class SealApplyAction extends BaseAction {
	@Resource
	private SealApplyService sealApplyService;

	@Resource
	private FileAttachService fileAttachService;
	private SealApply sealApply;

	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SealApply getSealApply() {
		return sealApply;
	}

	public void setSealApply(SealApply sealApply) {
		this.sealApply = sealApply;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		filter.addSorted("createDate", "desc");
		List<SealApply> list = sealApplyService.getAll(filter);

		Type type = new TypeToken<List<SealApply>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		/*
		 * Gson gson=new Gson(); buff.append(gson.toJson(list, type));
		 * buff.append("}");
		 */
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
				"createDate");
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
				"sealedDate");
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));
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
				sealApplyService.remove(new Long(id));
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
		SealApply sealApply = sealApplyService.get(id);

		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(sealApply));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	@SuppressWarnings("unchecked")
	public String save() {
		String fileIds = getRequest().getParameter("fileIds");
		System.out.println("----------------------------fileIds------------------------"+fileIds);
		if (fileIds != null && fileIds != "") {
			String[] fileids = fileIds.split(",");
			Set sealApplyFilesSet = new HashSet();
			for (String fileId : fileids) {
				System.out.println("----------------------------222222------------------------");
				FileAttach fileAttach = fileAttachService.get(new Long(fileId));
				sealApplyFilesSet.add(fileAttach);
			}
			sealApply.setSealApplyFiles(sealApplyFilesSet);
		}
		SealApply newSealApply = new SealApply();
		if (sealApply.getId() == null) {
			newSealApply = sealApplyService.save(sealApply);
		} else {
			SealApply orgSealApply = sealApplyService.get(sealApply.getId());
			try {
				BeanUtil.copyNotNullProperties(orgSealApply, sealApply);
				sealApplyService.save(orgSealApply);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(newSealApply));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;

	}
}
