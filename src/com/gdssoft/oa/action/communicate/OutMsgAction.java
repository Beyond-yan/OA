package com.gdssoft.oa.action.communicate;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.io.File;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.communicate.SmsMobile;
import com.gdssoft.oa.model.personal.AddrbookOuter;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.gdssoft.oa.service.personal.AddrbookOuterService;


/**
 * 
 * @author
 * 
 */
public class OutMsgAction extends BaseAction {
	@Resource
	private AddrbookOuterService addrbookOuterService;
	@Resource
	private SmsMobileService smsMobileService;
	//private AddrbookOuter addrbookOuter;
	private SmsMobile smsMobile;

	private Long id;

	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	
	public SmsMobile getSmsMobile() {
		return smsMobile;
	}

	public void setSmsMobile(SmsMobile smsMobile) {
		this.smsMobile = smsMobile;
	}


	/**
	 * 显示列表
	 */
	

	/**
	 * 添加及保存操作
	 */
	public String save() {
		
		//StringBuffer msg = new StringBuffer("");
		String mobile = getRequest().getParameter("phoneNumber");
		String name = getRequest().getParameter("OutMsg.userName");
		String content = getRequest().getParameter("OutMsg.smsContent");
		String personname = getRequest().getParameter("personname");
			//发送站外手机短信
		String[] mobiles = mobile.split(",");	
		int i=0;
		for(String phone : mobiles){
			i++;
/*			List<AddrbookOuter> addrbook = addrbookOuterService.getouter(phone);
			if(null!=addrbook&&addrbook.size()>0){
			for(AddrbookOuter outer : addrbook){
				SmsMobile smsInner = new SmsMobile();
				smsInner.setPhoneNumber(outer.getMobile());
				smsInner.setRecipients(outer.getPersonName());
				smsInner.setSendTime(new Date());
				smsInner.setSmsContent(content);
				smsInner.setUserId(ContextUtil.getCurrentUserId());
				smsInner.setUserName(name);
				smsInner.setStatus(SmsMobile.STATUS_NOT_SENDED);
				smsMobileService.save(smsInner);
			}}
			else{*/
				String[] personnames = personname.split(",");	
				SmsMobile smsInner = new SmsMobile();
				smsInner.setPhoneNumber(phone);
				if(i<=personnames.length)
				smsInner.setRecipients(personnames[i-1]);
				else
				smsInner.setRecipients("无");
				smsInner.setSendTime(new Date());
				smsInner.setSmsContent(content);
				smsInner.setUserId(ContextUtil.getCurrentUserId());
				smsInner.setUserName(name);
				smsInner.setStatus(SmsMobile.STATUS_NOT_SENDED);
				smsMobileService.save(smsInner);
			/*}*/
		}
/*					SmsMobile smsInner = new SmsMobile();
					smsInner.setPhoneNumber(mobile);
					smsInner.setRecipients(personname);
					//smsInner.setRecipientsId();
					smsInner.setSendTime(new Date());
					smsInner.setSmsContent(content);
					smsInner.setUserId(ContextUtil.getCurrentUserId());
					smsInner.setUserName(name);
					smsInner.setStatus(SmsMobile.STATUS_NOT_SENDED);
					smsMobileService.save(smsInner);*/			
		return SUCCESS;
	}
}
