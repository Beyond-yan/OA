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
import com.gdssoft.core.util.JsonUtil;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


import com.gdssoft.oa.model.system.SysUserAll;
import com.gdssoft.oa.service.system.SysUserAllService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class SysUserAllAction extends BaseAction{
	@Resource
	private SysUserAllService sysUserAllService;
	private SysUserAll sysUserAll;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SysUserAll getSysUserAll() {
		return sysUserAll;
	}

	public void setSysUserAll(SysUserAll sysUserAll) {
		this.sysUserAll = sysUserAll;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<SysUserAll> list= sysUserAllService.getAll(filter);
		
		Type type=new TypeToken<List<SysUserAll>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		/*Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");*/
		
		JSONSerializer json = JsonUtil.getJSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), "createDate","updateDate");
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
				sysUserAllService.remove(new Long(id));
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
		SysUserAll sysUserAll=sysUserAllService.get(id);
		
		/*Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(sysUserAll));
		sb.append("}");
		setJsonString(sb.toString());*/
		
		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), "createDate","updateDate");
		sb.append(serializer.exclude(new String[]{ "class"}).serialize(sysUserAll));
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(sysUserAll.getId()==null){
			sysUserAllService.save(sysUserAll);
		}else{
			SysUserAll orgSysUserAll=sysUserAllService.get(sysUserAll.getId());
			try{
				BeanUtil.copyNotNullProperties(orgSysUserAll, sysUserAll);
				sysUserAllService.save(orgSysUserAll);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
}
