package com.gdssoft.oa.action.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.security.providers.encoding.Md5PasswordEncoder;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.system.SysServiceAccount;
import com.gdssoft.oa.service.system.SysInterfaceAccountService;
import com.gdssoft.oa.service.system.SysServiceAccountService;
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
public class SysServiceAccountAction extends BaseAction{
	@Resource
	private SysServiceAccountService sysServiceAccountService;
	private SysServiceAccount sysServiceAccount;
	
	@Resource
	private SysInterfaceAccountService sysInterfaceAccountService;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SysServiceAccount getSysServiceAccount() {
		return sysServiceAccount;
	}

	public void setSysServiceAccount(SysServiceAccount sysServiceAccount) {
		this.sysServiceAccount = sysServiceAccount;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<SysServiceAccount> list= sysServiceAccountService.getAll(filter);
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
				sysInterfaceAccountService.removeByAccount(new Long(id));
				sysServiceAccountService.remove(new Long(id));
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
		SysServiceAccount sysServiceAccount=sysServiceAccountService.get(id);
	
		//将数据转成JSON格式
		StringBuffer buff = new StringBuffer("{success:true,data:");
		JSONSerializer json = JsonUtil.getJSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), "createDate","updateDate");
		buff.append(json.exclude(new String[] { "class" })
				.serialize(sysServiceAccount));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		Md5PasswordEncoder encoder = new Md5PasswordEncoder();
		if(null == sysServiceAccount.getId()){
			String newPassword = encoder.encodePassword(sysServiceAccount.getPassword(), null);
			sysServiceAccount.setPassword(newPassword);
			sysServiceAccount.setCreateUser(ContextUtil.getCurrentUser().getUsername());
			sysServiceAccount.setCreateDate(new Date());
			sysServiceAccount.setUpdateUser(ContextUtil.getCurrentUser().getUsername());
			sysServiceAccount.setUpdateDate(new Date());
			sysServiceAccountService.save(sysServiceAccount);
		}else{
			SysServiceAccount orgSysServiceAccount=sysServiceAccountService.get(sysServiceAccount.getId());
			try{
				sysServiceAccount.setUpdateUser(ContextUtil.getCurrentUser().getUsername());
				sysServiceAccount.setUpdateDate(new Date());
				BeanUtil.copyNotNullProperties(orgSysServiceAccount, sysServiceAccount);
				sysServiceAccountService.save(orgSysServiceAccount);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	
	public String resetPassword(){
		String accountId = getRequest().getParameter("accountId");
		String newPassword = getRequest().getParameter("newpassword");
		String rePassword = getRequest().getParameter("rePassword");
		StringBuffer msg = new StringBuffer("{msg:'");
		Md5PasswordEncoder encoder = new Md5PasswordEncoder();
		if (StringUtils.isNotEmpty(accountId)) {
			sysServiceAccount = sysServiceAccountService.get(new Long(accountId));
			if (newPassword.equals(rePassword)) {
				sysServiceAccount.setPassword(encoder.encodePassword(newPassword, null));
				sysServiceAccountService.save(sysServiceAccount);
			}else{
				msg.append("重置失败!,两次输入的密码不一致,请重新输入!.'");
				msg.append(",failure:true}");
				setJsonString(msg.toString());
			}
		}else{
			msg.append("重置密码失败，联系管理员！.'");
			msg.append(",failure:true}");
			setJsonString(msg.toString());
		}
		return SUCCESS;
	}
}
