package com.gdssoft.oa.action.system;
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


import com.gdssoft.oa.model.system.SysDepartmentConfig;
import com.gdssoft.oa.service.system.SysDepartmentConfigService;
/**
 * 
 * @author 
 *
 */
public class SysDepartmentConfigAction extends BaseAction{
	@Resource
	private SysDepartmentConfigService sysDepartmentConfigService;
	private SysDepartmentConfig sysDepartmentConfig;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SysDepartmentConfig getSysDepartmentConfig() {
		return sysDepartmentConfig;
	}

	public void setSysDepartmentConfig(SysDepartmentConfig sysDepartmentConfig) {
		this.sysDepartmentConfig = sysDepartmentConfig;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<SysDepartmentConfig> list= sysDepartmentConfigService.getAll(filter);
		
		Type type=new TypeToken<List<SysDepartmentConfig>>(){}.getType();
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
				sysDepartmentConfigService.remove(new Long(id));
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
		SysDepartmentConfig sysDepartmentConfig=sysDepartmentConfigService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(sysDepartmentConfig));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(sysDepartmentConfig.getId()==null){
			sysDepartmentConfigService.save(sysDepartmentConfig);
		}else{
			SysDepartmentConfig orgSysDepartmentConfig=sysDepartmentConfigService.get(sysDepartmentConfig.getId());
			try{
				BeanUtil.copyNotNullProperties(orgSysDepartmentConfig, sysDepartmentConfig);
				sysDepartmentConfigService.save(orgSysDepartmentConfig);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
}
