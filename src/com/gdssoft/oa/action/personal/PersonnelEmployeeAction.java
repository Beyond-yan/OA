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
import com.gdssoft.core.util.ContextUtil;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


import com.gdssoft.oa.model.personal.PersonnelEmployee;
import com.gdssoft.oa.service.personal.PersonnelEmployeeService;
import com.gdssoft.oa.service.system.AppUserService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class PersonnelEmployeeAction extends BaseAction{
	@Resource
	private PersonnelEmployeeService personnelEmployeeService;
	private PersonnelEmployee personnelEmployee;
	
	@Resource
	private AppUserService appUserService;
	
	private String pid;

	public String getPid()
	{
		return pid;
	}

	public void setPid(String pid)
	{
		this.pid = pid;
	}

	public PersonnelEmployee getPersonnelEmployee() {
		return personnelEmployee;
	}

	public void setPersonnelEmployee(PersonnelEmployee personnelEmployee) {
		this.personnelEmployee = personnelEmployee;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<PersonnelEmployee> list= personnelEmployeeService.getAll(filter);
		
		Type type=new TypeToken<List<PersonnelEmployee>>(){}.getType();
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
				personnelEmployeeService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get()
	{
		PersonnelEmployee personnelEmployee=personnelEmployeeService.getByUserID(pid.toString());			
		StringBuffer buff = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		buff.append(serializer.exclude(new String[]
		{ "class" }).serialize(personnelEmployee));
		buff.append("}");
		jsonString = buff.toString();
		logger.debug("GGG DEBUG: " + jsonString);	
		
		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save()
	{
		logger.debug("GGG DEBUG: pid:  " + pid);	
		if (pid == null)
		{
			//personnelEmployeeService.save(personnelEmployee);
		}
		else
		{
			try
			{
				appUserService.gupdate(
						pid.toString(), 
						personnelEmployee.getAppUser().getPhone(),
						personnelEmployee.getAppUser().getMobile(), 
						personnelEmployee.getAppUser().getEmail(),
						personnelEmployee.getAppUser().getPosition()
						);
			
				personnelEmployeeService.gupdate(pid.toString(), personnelEmployee.getOfficePhone(),personnelEmployee.getExt(), 
						personnelEmployee.getShortPhone(),personnelEmployee.getRoom(),personnelEmployee.getIsLeader(),personnelEmployee.getIsWorktel());
				
				
			}
			catch (Exception ex)
			{
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;

	}
}
