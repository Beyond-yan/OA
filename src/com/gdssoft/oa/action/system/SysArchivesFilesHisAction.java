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


import com.gdssoft.oa.model.system.SysArchivesFilesHis;
import com.gdssoft.oa.service.system.SysArchivesFilesHisService;
/**
 * 
 * @author 
 *
 */
public class SysArchivesFilesHisAction extends BaseAction{
	@Resource
	private SysArchivesFilesHisService sysArchivesFilesHisService;
	private SysArchivesFilesHis sysArchivesFilesHis;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SysArchivesFilesHis getSysArchivesFilesHis() {
		return sysArchivesFilesHis;
	}

	public void setSysArchivesFilesHis(SysArchivesFilesHis sysArchivesFilesHis) {
		this.sysArchivesFilesHis = sysArchivesFilesHis;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<SysArchivesFilesHis> list= sysArchivesFilesHisService.getAll(filter);
		
		Type type=new TypeToken<List<SysArchivesFilesHis>>(){}.getType();
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
				sysArchivesFilesHisService.remove(new Long(id));
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
		SysArchivesFilesHis sysArchivesFilesHis=sysArchivesFilesHisService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(sysArchivesFilesHis));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(sysArchivesFilesHis.getId()==null){
			sysArchivesFilesHisService.save(sysArchivesFilesHis);
		}else{
			SysArchivesFilesHis orgSysArchivesFilesHis=sysArchivesFilesHisService.get(sysArchivesFilesHis.getId());
			try{
				BeanUtil.copyNotNullProperties(orgSysArchivesFilesHis, sysArchivesFilesHis);
				sysArchivesFilesHisService.save(orgSysArchivesFilesHis);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
}
