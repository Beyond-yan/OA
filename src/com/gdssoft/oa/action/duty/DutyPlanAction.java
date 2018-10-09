package com.gdssoft.oa.action.duty;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import javax.annotation.Resource;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Type;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


import com.gdssoft.oa.model.admin.CarCostRecordDetail;
import com.gdssoft.oa.model.duty.DutyPlan;
import com.gdssoft.oa.model.duty.DutyStaff;
import com.gdssoft.oa.service.duty.DutyPlanService;
import com.gdssoft.oa.service.duty.DutyStaffService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class DutyPlanAction extends BaseAction{
	@Resource
	private DutyPlanService dutyPlanService;
	@Resource
	private DutyStaffService dutyStaffService;
	private DutyPlan dutyPlan;
	DutyStaff[] dutyStaffArray=null;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public DutyPlan getDutyPlan() {
		return dutyPlan;
	}

	public void setDutyPlan(DutyPlan dutyPlan) {
		this.dutyPlan = dutyPlan;
	}
	

	/**
	 * 显示列表
	 */
	public String list(){
		QueryFilter filter=new QueryFilter(getRequest());
		List<DutyPlan> list= dutyPlanService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"planDate","createDate"});
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
				dutyPlanService.remove(new Long(id));
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
		DutyPlan cqDutyPlan=dutyPlanService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(cqDutyPlan));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		String  data=getRequest().getParameter("data");
		Gson gson=new Gson();
		dutyStaffArray=(DutyStaff[])gson.fromJson(data, DutyStaff[].class);
		if(dutyPlan.getId()==null){
		    Calendar calendar = new GregorianCalendar();
		    calendar.setTime(dutyPlan.getPlanDate());
		    int year=calendar.get(Calendar.YEAR);
		    int weekOfYear=calendar.get(Calendar.WEEK_OF_YEAR);
		    String planNo=year+"年第"+weekOfYear+"周";
		    dutyPlan.setPlanNo(planNo);
			dutyPlan.setDepId(ContextUtil.getCurrentUser().getDepartment().getDepId());
			dutyPlan.setPlanner(ContextUtil.getCurrentUserId());
			dutyPlan.setCreateDate(new Date());
			dutyPlanService.save(dutyPlan);
			if(dutyStaffArray!=null){
				for(DutyStaff dutyStaff:dutyStaffArray){
					Calendar cl =  Calendar.getInstance();
					cl.setTime(dutyPlan.getPlanDate());
					cl.add(cl.DATE,dutyStaff.getDays());
					dutyStaff.setPlanId(dutyPlan.getId());
					dutyStaff.setDutyDate(cl.getTime());
					dutyStaffService.save(dutyStaff);
				}
			}
		}else{
			DutyPlan orgDutyPlan=dutyPlanService.get(dutyPlan.getId());
			QueryFilter filter=new QueryFilter(getRequest());
			filter.addFilter("Q_DutyPlan.id_L_EQ", orgDutyPlan.getId().toString());
			List<DutyStaff> staffList=dutyStaffService.getAll(filter);
			for(DutyStaff staff:staffList){
				dutyStaffService.remove(staff);
			}
			orgDutyPlan.setPlanner(ContextUtil.getCurrentUserId());
			orgDutyPlan.setDepId(ContextUtil.getCurrentUser().getDepartment().getDepId());
			dutyPlanService.save(orgDutyPlan);
			if(dutyStaffArray!=null){
				for(DutyStaff dutyStaff:dutyStaffArray){
					Calendar cl =  Calendar.getInstance();
					cl.setTime(dutyPlan.getPlanDate());
					cl.add(cl.DATE,dutyStaff.getDays());
					dutyStaff.setPlanId(dutyPlan.getId());
					dutyStaff.setDutyDate(cl.getTime());
					dutyStaffService.save(dutyStaff);
				}
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
	/**
	 * 判断是否已安排值班
	 */
	public String isContain(){
		if(dutyPlan.getPlanDate()!=null&&dutyPlan.getId()==null){
			QueryFilter filter=new QueryFilter(getRequest());
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			String planDate=formatter.format(dutyPlan.getPlanDate());
			filter.addFilter("Q_planDate_D_EQ", planDate);
			List<DutyPlan> list=dutyPlanService.getAll(filter);
			if(list.size()>0){
				setJsonString("{success:false}");
			}else{
				setJsonString("{success:true}");
			}
		} else{
			setJsonString("{success:true}");
		}
		return SUCCESS;
	}
}
