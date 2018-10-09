package com.gdssoft.oa.action.info;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;

import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


import com.gdssoft.oa.model.info.InfoType;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.info.InfoTypeService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class InfoTypeAction extends BaseAction{
	@Resource
	private InfoTypeService infoTypeService;
	private InfoType infoType;
	
	private Long typeid;

	public Long getTypeid() {
		return typeid;
	}

	public void setTypeid(Long typeid) {
		this.typeid = typeid;
	}

	public InfoType getInfoType() {
		return infoType;
	}

	public void setInfoType(InfoType infoType) {
		this.infoType = infoType;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<InfoType> list= infoTypeService.getAll(filter);
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
				infoTypeService.remove(new Long(id));
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
		InfoType infoType=infoTypeService.get(typeid);
		//将数据转成JSON格式
		StringBuffer buff = new StringBuffer("{success:true,data:");
		JSONSerializer json = JsonUtil.getJSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), "createDate","updateDate");
		buff.append(json.exclude(new String[] { "class" })
				.serialize(infoType));
		buff.append("}");
		jsonString=buff.toString();
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		AppUser appUser=ContextUtil.getCurrentUser();
		if(infoType.getTypeid()==null){
			infoType.setCreateUser(appUser.getFamilyName());
			infoType.setCreateDate(new Date());
			infoTypeService.save(infoType);
		}else{
			InfoType orgInfoType=infoTypeService.get(infoType.getTypeid());
			try{
				BeanUtil.copyNotNullProperties(orgInfoType, infoType);
				orgInfoType.setUpdateUser(appUser.getFullname());
				orgInfoType.setUpdateDate(new Date());
				infoTypeService.save(orgInfoType);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	/**
	 * 信息类型下来列表
	 */
	public String combo(){
		QueryFilter filter=new QueryFilter(getRequest());
		List<InfoType> list= infoTypeService.getAll(filter);
		StringBuffer buff = new StringBuffer("[");
		for(InfoType infoType:list){
			buff.append("['").append(infoType.getTypeid()).append("','")
			.append(infoType.getTypeName()).append("']").append(",");
		}
		buff.deleteCharAt(buff.length()-1);
		buff.append("]");
		this.setJsonString(buff.toString());
		return SUCCESS;
	}
}
