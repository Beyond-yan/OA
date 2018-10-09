package com.gdssoft.oa.action.archive;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
 */
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.OdFlowtype;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.OdFlowtypeService;
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
public class OdFlowtypeAction extends BaseAction {
	@Resource
	private OdFlowtypeService odFlowtypeService;
	private OdFlowtype odFlowtype;

	private Long id;

	private Short flowType;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public OdFlowtype getOdFlowtype() {
		return odFlowtype;
	}

	public void setOdFlowtype(OdFlowtype odFlowtype) {
		this.odFlowtype = odFlowtype;
	}

	public Short getFlowType() {
		return flowType;
	}

	public void setFlowType(Short flowType) {
		this.flowType = flowType;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		List<OdFlowtype> list = odFlowtypeService.getAll(filter);

		Type type = new TypeToken<List<OdFlowtype>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		//		
		// Gson gson=new Gson();
		// buff.append(gson.toJson(list, type));
		// buff.append("}");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
				"createDate");
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
				"updateDate");
		// serializer.transform(new DateTransformer("yyyy-MM-dd"),
		// "dayTime");
		// serializer.transform(new DateTransformer("hh:mm"),
		// "onDutyTime");
		// serializer.transform(new DateTransformer("hh:mm"),
		// "offDutyTime");
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
				odFlowtypeService.remove(new Long(id));
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
		OdFlowtype odFlowtype = odFlowtypeService.get(id);

		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");

		// sb.append(gson.toJson(odFlowtype));
		// sb.append("}");
		// setJsonString(sb.toString());

		JSONSerializer serializer = new JSONSerializer();
		// serializer.transform(new DateTransformer("yyyy-MM-dd"),
		// "dayTime");
		// serializer.transform(new DateTransformer("hh:mm"),
		// "onDutyTime");
		// serializer.transform(new DateTransformer("hh:mm"),
		// "offDutyTime");
		sb.append(serializer.exclude(new String[] { "class" }).serialize(
				odFlowtype));
		sb.append("}");

		jsonString = sb.toString();
		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		AppUser currentUser = ContextUtil.getCurrentUser();
		String userAccount = currentUser.getUsername();
		Date date = new Date();
		if (odFlowtype.getId() == null) {
			odFlowtype.setCreateBy(userAccount);
			odFlowtype.setCreateDate(date);
			odFlowtype.setUpdateBy(userAccount);
			odFlowtype.setUpdateDate(date);
			odFlowtypeService.save(odFlowtype);
		} else {
			OdFlowtype orgOdFlowtype = odFlowtypeService
					.get(odFlowtype.getId());
			try {
				BeanUtil.copyNotNullProperties(orgOdFlowtype, odFlowtype);
				orgOdFlowtype.setUpdateBy(userAccount);
				orgOdFlowtype.setUpdateDate(date);
				odFlowtypeService.save(orgOdFlowtype);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;

	}

	/**
	 * 获取某一类型所有公文流程
	 * 
	 * @author F3222500
	 * @param FlowType
	 */
	public String getFlowByType() {
		List<OdFlowtype> list = odFlowtypeService.getFlowByType(flowType);
		StringBuffer buff = new StringBuffer("[");
		for (OdFlowtype of : list) {
			buff.append("['" + of.getId().toString() + "','" + of.getFlowName()
					+ "'],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}
}
