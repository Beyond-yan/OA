package com.gdssoft.oa.action.duty;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;

import java.lang.reflect.Type;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.util.BeanUtil;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


import com.gdssoft.oa.model.duty.DutyStaff;
import com.gdssoft.oa.service.duty.DutyStaffService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class DutyStaffAction extends BaseAction{
	@Resource
	private DutyStaffService dutyStaffService;
	private DutyStaff dutyStaff;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public DutyStaff getDutyStaff() {
		return dutyStaff;
	}

	public void setDutyStaff(DutyStaff dutyStaff) {
		this.dutyStaff = dutyStaff;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		QueryFilter filter=new QueryFilter(getRequest());
		List<DutyStaff> list= dutyStaffService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
			"dutyDate"});
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				dutyStaffService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		DutyStaff cqDutyStaff=dutyStaffService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(cqDutyStaff));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(dutyStaff.getId()==null){
			dutyStaffService.save(dutyStaff);
		}else{
			DutyStaff orgDutyStaff=dutyStaffService.get(dutyStaff.getId());
			try{
				BeanUtil.copyNotNullProperties(orgDutyStaff, dutyStaff);
				dutyStaffService.save(orgDutyStaff);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	/**
	 * 显示值班列表
	 */
	public String listAll(){
		Date startDate=null;
		Date endDate=null;
		QueryFilter filter=new QueryFilter(getRequest());
		String startTime=getRequest().getParameter("DA_startTime");
		String endTime=getRequest().getParameter("DA_endTime");
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		if (startTime != null && !"".equals(startTime)) {
			try {
				startDate=formatter.parse(startTime);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		if (endTime != null && !"".equals(endTime)) {
			try {
				endDate=formatter.parse(endTime);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		List<DutyStaff> list= dutyStaffService.getDutyList(filter.getPagingBean().getStart(),startDate,endDate);
		for(DutyStaff dutyStaff:list){
			Calendar cl =  Calendar.getInstance();
			cl.setTime(dutyStaff.getDutyDate());
			dutyStaff.setDays(cl.get(Calendar.DAY_OF_WEEK));
		}
		Long count=dutyStaffService.getCount((long) 1,startDate,endDate);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(count).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
			"dutyDate"});
		buff.append(json.exclude(new String[] { "class","appUser.password"}).serialize(list));
		buff.append("}");
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 加载值班数据列表
	 */
	public String dutyList(){
		String planId=getRequest().getParameter("planId");
		QueryFilter filter=new QueryFilter(getRequest());
		filter.addFilter("Q_DutyPlan.id_L_EQ", planId);
		filter.addSorted("dutyDate","asc");
		List<DutyStaff> list=dutyStaffService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,data:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
			"dutyDate","dutyPlan.planDate"});
		buff.append(json.exclude(new String[] { "class","appUser.password","appUser.department"}).serialize(list));
		buff.append("}");
		jsonString=buff.toString();
		return SUCCESS;
	}
}
