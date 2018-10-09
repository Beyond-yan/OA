package com.gdssoft.oa.action.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.system.SysInterfaceAccount;
import com.gdssoft.oa.model.system.SysServiceAccount;
import com.gdssoft.oa.model.system.SysServiceInterface;
import com.gdssoft.oa.service.system.SysInterfaceAccountService;
import com.google.gson.reflect.TypeToken;

import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class SysInterfaceAccountAction extends BaseAction{
	@Resource
	private SysInterfaceAccountService sysInterfaceAccountService;
	private SysInterfaceAccount sysInterfaceAccount;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SysInterfaceAccount getSysInterfaceAccount() {
		return sysInterfaceAccount;
	}

	public void setSysInterfaceAccount(SysInterfaceAccount sysInterfaceAccount) {
		this.sysInterfaceAccount = sysInterfaceAccount;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<SysInterfaceAccount> list= sysInterfaceAccountService.getAll(filter);
		
		Type type=new TypeToken<List<SysInterfaceAccount>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		JSONSerializer json = JsonUtil.getJSONSerializer();
//		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), "createDate","updateDate");
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
				sysInterfaceAccountService.remove(new Long(id));
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
		SysInterfaceAccount sysInterfaceAccount=sysInterfaceAccountService.get(id);
		
		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		sb.append(serializer.exclude(new String[]{ "class"}).serialize(sysInterfaceAccount));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		String[] ids=getRequest().getParameterValues("ids");
		String accountId=getRequest().getParameter("accountId");
		sysInterfaceAccountService.removeByAccount(new Long(accountId));
		SysServiceAccount sysServiceAccount = new SysServiceAccount();
		sysServiceAccount.setId(new Long(accountId));
		if(ids!=null && ids.length>0){
			for(String id:ids){
				if(id.length()>0){
					SysServiceInterface sysServiceInterface = new SysServiceInterface();
					SysInterfaceAccount sysInterfaceAccount = new SysInterfaceAccount();
					sysServiceInterface.setId(new Long(id));
					sysInterfaceAccount.setSysServiceAccount(sysServiceAccount);
					sysInterfaceAccount.setSysServiceInterface(sysServiceInterface);
					sysInterfaceAccountService.save(sysInterfaceAccount);
				}
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	
	/**
	 * 查找用户权限
	 * @return
	 */
	public String getByAccount(){
		String accountId = getRequest().getParameter("accountId");
		List<SysInterfaceAccount> list=sysInterfaceAccountService.getByAccount(new Long(accountId));
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':");
		if(null != list){
			buff.append(list.size());
		}else{
			buff.append(0);
		}
		
		buff.append(",result:");
		
		JSONSerializer json = JsonUtil.getJSONSerializer();
		buff.append(json.exclude(new String[] { "class" })
				.serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	public String getIds(){
		String accountId = getRequest().getParameter("accountId");
		StringBuffer sb = new StringBuffer("[");
		if(accountId!=null){
			QueryFilter filter=new QueryFilter(getRequest());
			filter.addFilter("Q_sysServiceAccount.id_L_EQ",accountId);
			List<SysInterfaceAccount> list= sysInterfaceAccountService.getAll(filter);
			for(SysInterfaceAccount sysInterfaceAccount:list){
				sb.append(sysInterfaceAccount.getSysServiceInterface().getId() + ",");
			}
			if(!list.isEmpty()){
				sb.deleteCharAt(sb.length() - 1);
			}
			sb.append("]");
		}
		setJsonString(sb.toString());
		return SUCCESS;
	}
}
