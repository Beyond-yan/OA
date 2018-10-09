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
import com.gdssoft.oa.service.system.SysOaSiteService;
import com.gdssoft.oa.service.system.SysSchemaConfigService;
import com.google.gson.reflect.TypeToken;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class SysOaSiteAction extends BaseAction{
	@Resource
	private SysOaSiteService sysOaSiteService;
	private SysOaSite sysOaSite;
	
	@Resource
	private SysSchemaConfigService sysSchemaConfigService;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SysOaSite getSysOaSite() {
		return sysOaSite;
	}

	public void setSysOaSite(SysOaSite sysOaSite) {
		this.sysOaSite = sysOaSite;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<SysOaSite> list= sysOaSiteService.getAll(filter);
		
		Type type=new TypeToken<List<SysOaSite>>(){}.getType();
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
		
		int scSize = 0;
		if(ids!=null){
			for(String id:ids){
				scSize += sysSchemaConfigService.getSizeBySite(new Long(id));
			}
		}
		
		if(ids!=null && scSize==0){
			for(String id:ids){
				sysOaSiteService.remove(new Long(id));
			}
			jsonString="{success:true}";
		}else{
			jsonString="{success:false,message:'该部署点下有SCHEMA，请将SCHEMA移后再删除部署点!'}";
		}
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		SysOaSite sysOaSite=sysOaSiteService.get(id);
		
//		sysOaSite.setSysSchemaConfigs(null);//赋值为空，否则目前方法无法转换格式
		
//		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		/*Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.setDateFormat("yyyy-MM-dd").create();*/
		//将数据转成JSON格式
		/*StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(sysOaSite));
		sb.append("}");*/
		
		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), "createDate","updateDate");
		sb.append(serializer.exclude(new String[]{ "class"}).serialize(sysOaSite));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		AppUser user = ContextUtil.getCurrentUser();
		if(sysOaSite.getId()==null){
			sysOaSite.setCreateUser(user.getFullname());
			sysOaSite.setCreateDate(new Date());
			sysOaSiteService.save(sysOaSite);
		}else{
			SysOaSite orgSysOaSite=sysOaSiteService.get(sysOaSite.getId());
			sysOaSite.setUpdateUser(user.getFullname());
			sysOaSite.setUpdateDate(new Date());
			try{
				BeanUtil.copyNotNullProperties(orgSysOaSite, sysOaSite);
				sysOaSiteService.save(orgSysOaSite);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	
	/**
	 *判断本站点是否存在
	 */
	public String haveOwner(){
		String id=getRequest().getParameter("id");
		List<SysOaSite> list = null;
		if(null == id || "" == id){
			list = sysOaSiteService.haveOwner();
		}else{
			list = sysOaSiteService.haveOwner(new Long(id));
		}
		StringBuffer sb = new StringBuffer();
		if(list.size()> 0){
			sb.append("{success:true,data:'true'");
		}else{
			sb.append("{success:false,data:'false'");
		}
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
}
