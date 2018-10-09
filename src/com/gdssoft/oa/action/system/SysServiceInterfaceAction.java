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
import com.gdssoft.oa.model.system.SysServiceInterface;
import com.gdssoft.oa.service.system.SysServiceInterfaceService;
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
public class SysServiceInterfaceAction extends BaseAction{
	@Resource
	private SysServiceInterfaceService sysServiceInterfaceService;
	private SysServiceInterface sysServiceInterface;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SysServiceInterface getSysServiceInterface() {
		return sysServiceInterface;
	}

	public void setSysServiceInterface(SysServiceInterface sysServiceInterface) {
		this.sysServiceInterface = sysServiceInterface;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<SysServiceInterface> list= sysServiceInterfaceService.getAll(filter);
		
		Type type=new TypeToken<List<SysServiceInterface>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		JSONSerializer json = JsonUtil.getJSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), "createDate","updateDate");
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
				sysServiceInterfaceService.remove(new Long(id));
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
		SysServiceInterface sysServiceInterface=sysServiceInterfaceService.get(id);
		
		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), "createDate","updateDate");
		sb.append(serializer.exclude(new String[]{ "class"}).serialize(sysServiceInterface));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(null == sysServiceInterface.getId()){
			sysServiceInterface.setCreateUser(ContextUtil.getCurrentUser().getUsername());
			sysServiceInterface.setCreateDate(new Date());
			sysServiceInterface.setUpdateUser(ContextUtil.getCurrentUser().getUsername());
			sysServiceInterface.setUpdateDate(new Date());
			sysServiceInterfaceService.save(sysServiceInterface);
		}else{
			SysServiceInterface orgSysServiceInterface=sysServiceInterfaceService.get(sysServiceInterface.getId());
			sysServiceInterface.setUpdateUser(ContextUtil.getCurrentUser().getUsername());
			sysServiceInterface.setUpdateDate(new Date());
			try{
				BeanUtil.copyNotNullProperties(orgSysServiceInterface, sysServiceInterface);
				sysServiceInterfaceService.save(orgSysServiceInterface);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	
	public String getIdAndName(){
		List<SysServiceInterface> list = sysServiceInterfaceService.getAll();
		StringBuffer bf = new StringBuffer("[['','全部'],");
		for(SysServiceInterface ssi : list){
			bf.append("['").append(ssi.getId()).append("','").append(ssi.getServiceName()).append("'],");
		}
		bf.deleteCharAt(bf.length() - 1).append("]");
		setJsonString(bf.toString());
		return SUCCESS;
	}
}
