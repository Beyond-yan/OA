package com.gdssoft.oa.action.admin;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.admin.CarDriver;
import com.gdssoft.oa.service.admin.CarDriverService;
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
public class CarDriverAction extends BaseAction {
	@Resource
	private CarDriverService carDriverService;
	private CarDriver carDriver;

	private Long id;
	private String status;

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public CarDriver getCarDriver() {
		return carDriver;
	}

	public void setCarDriver(CarDriver carDriver) {
		this.carDriver = carDriver;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());

		if (getRequest().getParameter("sort") == null
				&& getRequest().getParameter("dir") == null) {
			filter.addSorted("updateDate", "DESC");
		}

		List<CarDriver> list = carDriverService.getAll(filter);

		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
				"licenseSDt");
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
				"licenseEDt");
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
				carDriverService.remove(new Long(id));
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

		CarDriver carDriver = carDriverService.get(id);

//		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
//		// 将数据转成JSON格式
//		StringBuffer sb = new StringBuffer("{success:true,data:");
//		sb.append(gson.toJson(carDriver));
//		sb.append("}");
//		setJsonString(sb.toString());
//		logger.info(sb.toString());
		
		StringBuffer buff = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		buff.append(serializer.exclude(new String[]
		{ "class" }).serialize(carDriver));
		buff.append("}");
		jsonString = buff.toString();
		logger.debug("GGG DEBUG: " + jsonString);
		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		logger.info(gson.toJson(carDriver));

		System.out.println("-----------" + carDriver.toString());

		if (carDriver.getId() == null) {
			carDriver.setStatus(new Short("1"));
			carDriver.setCreateBy(ContextUtil.getCurrentUser().getUsername());
			carDriver.setCreateDate(new Date());
			carDriver.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
			carDriver.setUpdateDate(new Date());

			carDriverService.save(carDriver);
		} else {
			CarDriver orgCarDriver = carDriverService.get(carDriver.getId());
			orgCarDriver
					.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
			orgCarDriver.setUpdateDate(new Date());
			try {
				BeanUtil.copyNotNullProperties(orgCarDriver, carDriver);
				carDriverService.save(orgCarDriver);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;

	}

	/**
	 * 
	 * 获取空闲的司机
	 * 
	 * @return
	 */
	public String getUseless() {
		System.out.println("----staus-----" + status);
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_status_SN_EQ", status);
		List<CarDriver> list = carDriverService.getAll(filter);
		Type type = new TypeToken<List<CarDriver>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		Gson gson = new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");

		jsonString = buff.toString();
		return SUCCESS;
	}

	public String delPhoto() {
		if (id != null) {
			CarDriver carDriver = carDriverService.get(id);
			carDriver.setImageSource("");
			carDriver.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
			carDriver.setUpdateDate(new Date());
			carDriverService.save(carDriver);
		}
		return SUCCESS;
	}

}
