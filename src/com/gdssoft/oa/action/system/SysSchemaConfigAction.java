package com.gdssoft.oa.action.system;
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
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysOaSite;
import com.gdssoft.oa.model.system.SysSchemaConfig;
import com.gdssoft.oa.service.system.SysOaSiteService;
import com.gdssoft.oa.service.system.SysSchemaConfigService;
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
public class SysSchemaConfigAction extends BaseAction{
	@Resource
	private SysSchemaConfigService sysSchemaConfigService;
	@Resource
	private SysOaSiteService sysOaSiteService;
	private SysSchemaConfig sysSchemaConfig;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SysSchemaConfig getSysSchemaConfig() {
		return sysSchemaConfig;
	}

	public void setSysSchemaConfig(SysSchemaConfig sysSchemaConfig) {
		this.sysSchemaConfig = sysSchemaConfig;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<SysSchemaConfig> list= sysSchemaConfigService.getAll(filter);
		
		Type type=new TypeToken<List<SysSchemaConfig>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
//		Gson gson=new Gson();
		JSONSerializer json = JsonUtil.getJSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), "createDate","updateDate");
//		buff.append(gson.toJson(list, type));
		buff.append(json.exclude(new String[] { "class" })
				.serialize(list));
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
				sysSchemaConfigService.remove(new Long(id));
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
		SysSchemaConfig sysSchemaConfig=sysSchemaConfigService.get(id);
		
		/*Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(sysSchemaConfig));
		sb.append("}");
		setJsonString(sb.toString());*/
		
		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), "createDate","updateDate");
		sb.append(serializer.exclude(new String[]{ "class"}).serialize(sysSchemaConfig));
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		AppUser user = ContextUtil.getCurrentUser();
	if(sysSchemaConfig.getId()==null){
			sysSchemaConfig.setCreateUser(user.getFullname());
			sysSchemaConfig.setCreateDate(new Date());
			sysSchemaConfigService.save(sysSchemaConfig);
		}else{
			sysSchemaConfig.setUpdateUser(user.getFullname());
			sysSchemaConfig.setUpdateDate(new Date());
			try{
				sysSchemaConfigService.update(sysSchemaConfig);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	
	/**
	 * 
	 * 查找部署点
	 */
	public String getSysOaSite(){
		List<SysOaSite> list = sysOaSiteService.getAll();
		StringBuffer bf = new StringBuffer("[['','全部'],");
		for(SysOaSite so : list){
			bf.append("['").append(so.getId()).append("','").append(so.getSiteName()).append("'],");
		}
		bf.deleteCharAt(bf.length() - 1).append("]");
		setJsonString(bf.toString());
		return SUCCESS;
	}
	/**
	 * 
	 * 查找部署点不包换全部
	 */
	public String getSysOaSite1(){
		List<SysOaSite> list = sysOaSiteService.getAll();
		StringBuffer bf = new StringBuffer("[");
		for(SysOaSite so : list){
			bf.append("['").append(so.getId()).append("','").append(so.getSiteName()).append("'],");
		}
		bf.deleteCharAt(bf.length() - 1).append("]");
		setJsonString(bf.toString());
		return SUCCESS;
	}
	
	/**
	 * 
	 * 查找Schema
	 */
	public String getSchema(){
		List<SysSchemaConfig> list = sysSchemaConfigService.getAll();
		StringBuffer bf = new StringBuffer("[['','全部'],");
		for(SysSchemaConfig ssc : list){
			bf.append("['").append(ssc.getId()).append("','").append(ssc.getSchemaCode()).append("'],");
		}
		bf.deleteCharAt(bf.length() - 1).append("]");
		setJsonString(bf.toString());
		return SUCCESS;
	}
	
	/**
	 * 查找Schema，不包含全部字段
	 */
	public String getAllSchema(){
		List<SysSchemaConfig> list = sysSchemaConfigService.getAll();
		StringBuffer bf = new StringBuffer("[");
		for(SysSchemaConfig ssc : list){
			bf.append("['").append(ssc.getId()).append("','").append(ssc.getSchemaCode()).append("'],");
		}
		bf.deleteCharAt(bf.length() - 1).append("]");
		setJsonString(bf.toString());
		return SUCCESS;
	}
}
