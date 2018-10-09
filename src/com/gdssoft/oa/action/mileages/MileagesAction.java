package com.gdssoft.oa.action.mileages;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.mileages.Mileages;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.mileages.MileagesService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class MileagesAction extends BaseAction {
	@Resource
	private MileagesService mileagesService;
	private Mileages mileages;

	private Long id;

	public MileagesService getMileagesService() {
		return mileagesService;
	}

	public void setMileagesService(MileagesService mileagesService) {
		this.mileagesService = mileagesService;
	}

	public Mileages getMileages() {
		return mileages;
	}

	public void setMileages(Mileages mileages) {
		this.mileages = mileages;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	/**
	 * 显示列表
	 */
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());
/*		if (getRequest().getParameter("sort") == null
				&& getRequest().getParameter("dir") == null) {
			filter.addSorted("updateDate", "DESC");
		}*/
		filter.addSorted("createDate", "DESC");
		filter.addSorted("updateDate", "DESC");
		List<Mileages> list = mileagesService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer json = JsonUtil.getJSONSerializer("createDate",
				"updateDate");
		json.transform(new DateTransformer("yyyy-MM-dd"), "travelDate");
		buff.append(json.exclude(new String[] { "class" })
				.serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}
	public String listbycar() {
		Date startTime=null;
		Date endTime=null;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
		String startDate = getRequest().getParameter("startDate");
		String endDate = getRequest().getParameter("endDate");
		if(startDate!=null&&!"".equals(startDate)){
			try {
				startTime=sdf.parse(startDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			
		}
		if(endDate!=null&&!"".equals(endDate)){
			try {
				endTime=sdf.parse(endDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		int size = Integer.parseInt(getRequest().getParameter("limit"));
		int start = Integer.parseInt(getRequest().getParameter("start"));
		String cn="";
		if(getRequest().getParameter("carno")!=null){
				cn=getRequest().getParameter("carno");
						}
		List<Mileages> list = mileagesService.selectByCostType(startTime, endTime,cn,size, start);
		Long con = mileagesService.count(startTime, endTime,cn);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':").append(con).append(
				",result:");;
		JSONSerializer serializer = new JSONSerializer();
	    serializer.transform(new DateTransformer("yyyy"),
                "travelDate");
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
		logger.debug(getRequest().getParameterValues("ids"));

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				mileagesService.remove(new Long(id));
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

		Mileages mileages = mileagesService.get(id);
		StringBuffer buff = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		buff.append(serializer.exclude(new String[]
		{ "class" }).serialize(mileages));
		buff.append("}");
		jsonString = buff.toString();
		logger.debug("GGG DEBUG: " + jsonString);
		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		if (mileages.getId() == null) {
			mileages.setCreateDate(new Date());
			AppUser currentUser = ContextUtil.getCurrentUser();
			mileages.setCreateUser(currentUser.getFullname());
			mileagesService.save(mileages);
		} else {
			Mileages orgmileage = mileagesService.get(mileages.getId());
			orgmileage.setUpdateUser(ContextUtil.getCurrentUser().getFullname());
			orgmileage.setUpdateDate(new Date());
			try {
				BeanUtil.copyNotNullProperties(orgmileage, mileages);
				mileagesService.save(orgmileage);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;

	}

}
