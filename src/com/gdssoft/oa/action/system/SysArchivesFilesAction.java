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


import com.gdssoft.oa.model.system.SysArchivesFiles;
import com.gdssoft.oa.service.system.SysArchivesFilesService;

import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class SysArchivesFilesAction extends BaseAction{
	@Resource
	private SysArchivesFilesService sysArchivesFilesService;
	private SysArchivesFiles sysArchivesFiles;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SysArchivesFiles getSysArchivesFiles() {
		return sysArchivesFiles;
	}

	public void setSysArchivesFiles(SysArchivesFiles sysArchivesFiles) {
		this.sysArchivesFiles = sysArchivesFiles;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		String id = getRequest().getParameter("id");
		String fileType = getRequest().getParameter("fileType");
		if (id != null && !"".equals(id)) {
			filter.addFilter("Q_sysDataTransfer.id_L_EQ", id);
		}
		if(null !=fileType && "" != fileType){
			filter.addFilter("Q_fileType_L_EQ", fileType);
		}
		
		List<SysArchivesFiles> list= sysArchivesFilesService.getAll(filter);
		
		Type type=new TypeToken<List<SysArchivesFiles>>(){}.getType();
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":")
		.append(filter.getPagingBean().getTotalItems()).append(
				",\"result\":");
		JSONSerializer json = JsonUtil.getJSONSerializer("fileDate",
				"fileAttach.createtime");
		buff.append(json.serialize(list));
		buff.append("}");
		/*StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");*/
		
		/*Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");*/
		
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
				if(null != id && "" !=id){
					sysArchivesFilesService.remove(new Long(id));
				}
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
		SysArchivesFiles sysArchivesFiles=sysArchivesFilesService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(sysArchivesFiles));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(sysArchivesFiles.getId()==null){
			sysArchivesFilesService.save(sysArchivesFiles);
		}else{
			SysArchivesFiles orgSysArchivesFiles=sysArchivesFilesService.get(sysArchivesFiles.getId());
			try{
				BeanUtil.copyNotNullProperties(orgSysArchivesFiles, sysArchivesFiles);
				sysArchivesFilesService.save(orgSysArchivesFiles);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
}
