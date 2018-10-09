package com.gdssoft.oa.action.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;
import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Type;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysDataTransferHis;
import com.gdssoft.oa.model.system.SysUserAll;
import com.gdssoft.oa.service.system.SysDataTransferHisService;
import com.gdssoft.oa.service.system.SysUserAllService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class SysDataTransferHisAction extends BaseAction{
	@Resource
	private SysDataTransferHisService sysDataTransferHisService;
	private SysDataTransferHis sysDataTransferHis;
	@Resource
	private SysUserAllService sysUserAllService;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SysDataTransferHis getSysDataTransferHis() {
		return sysDataTransferHis;
	}

	public void setSysDataTransferHis(SysDataTransferHis sysDataTransferHis) {
		this.sysDataTransferHis = sysDataTransferHis;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		String queryType = this.getRequest().getParameter("queryType");
		if(StringUtils.isBlank(queryType)) queryType = "send";
		QueryFilter filter=new QueryFilter(getRequest());
		AppUser user = ContextUtil.getCurrentUser();
		SysUserAll sysUserAll = sysUserAllService.findByUserName(user.getUsername());
		if (!user.getIsAdmin()) {
			if (queryType.equals("send")) {
				filter.addFilter("Q_issuerid_L_EQ", user.getUserId().toString());
				filter.addFilter("Q_fromSchema_L_EQ", sysUserAll.getSchemaId()
						.toString());
			}else{
				filter.addFilter("Q_toSchemaId_L_EQ", sysUserAll.getSchemaId()
						.toString());
				filter.addFilter("Q_receiveDep_S_EQ", user.getDepartment()
						.getDepUnitCode());
			}
		}
		filter.addSorted("updateDate", "desc");
		List<SysDataTransferHis> list= sysDataTransferHisService.getAll(filter);
		
		Type type=new TypeToken<List<SysDataTransferHis>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		/*Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");*/
		JSONSerializer json = JsonUtil.getJSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
				"receiveDate", "createDate","updateDate");
		json.transform(new DateTransformer("yyyy-MM-dd"),
				"writtenDate");
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
				sysDataTransferHisService.remove(new Long(id));
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
		SysDataTransferHis sysDataTransferHis=sysDataTransferHisService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(sysDataTransferHis));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(sysDataTransferHis.getId()==null){
			sysDataTransferHisService.save(sysDataTransferHis);
		}else{
			SysDataTransferHis orgSysDataTransferHis=sysDataTransferHisService.get(sysDataTransferHis.getId());
			try{
				BeanUtil.copyNotNullProperties(orgSysDataTransferHis, sysDataTransferHis);
				sysDataTransferHisService.save(orgSysDataTransferHis);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
}
