package com.gdssoft.oa.action.personal;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;
import javax.annotation.Resource;

import java.lang.reflect.Type;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.util.BeanUtil;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


import com.gdssoft.oa.model.personal.PersonnelLeaveApply;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.service.personal.PersonnelLeaveApplyService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.SysConfigService;
/**
 * 
 * @author 
 *
 */
public class PersonnelLeaveApplyAction extends BaseAction{
	@Resource
	private PersonnelLeaveApplyService personnelLeaveApplyService;
	@Resource
	private SysConfigService sysConfigService;
	private PersonnelLeaveApply personnelLeaveApply;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public PersonnelLeaveApply getPersonnelLeaveApply() {
		return personnelLeaveApply;
	}

	public void setPersonnelLeaveApply(PersonnelLeaveApply personnelLeaveApply) {
		this.personnelLeaveApply = personnelLeaveApply;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<PersonnelLeaveApply> list= personnelLeaveApplyService.getAll(filter);
		
		Type type=new TypeToken<List<PersonnelLeaveApply>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
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
				personnelLeaveApplyService.remove(new Long(id));
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
		PersonnelLeaveApply personnelLeaveApply=personnelLeaveApplyService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd hh:mm:ss").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(personnelLeaveApply));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(personnelLeaveApply.getId()==null){
			personnelLeaveApplyService.save(personnelLeaveApply);
		}else{
			PersonnelLeaveApply orgPersonnelLeaveApply=personnelLeaveApplyService.get(personnelLeaveApply.getId());
			try{
				BeanUtil.copyNotNullProperties(orgPersonnelLeaveApply, personnelLeaveApply);
				personnelLeaveApplyService.save(orgPersonnelLeaveApply);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true,leavepplyId:"+personnelLeaveApply.getId()+"}");
		return SUCCESS;
		
	}
	
	public String getTypeCombo(){
		QueryFilter filter=new QueryFilter(getRequest());
		filter.addFilter("Q_typeKey_S_EQ", "vacationTypeConfig");
		List<SysConfig> list= sysConfigService.getAll(filter);
		
		StringBuffer buff = new StringBuffer("[");
		for (SysConfig sysCinfig : list) {
			buff.append("['" + sysCinfig.getDataValue().toString() + "','"
					+ sysCinfig.getConfigName() + "'],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"+buff.toString());
		
		
		jsonString=buff.toString();
		return SUCCESS;
	}
}
