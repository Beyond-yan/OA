package com.gdssoft.oa.service.communicate.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.communicate.MailDao;
import com.gdssoft.oa.model.communicate.Mail;
import com.gdssoft.oa.service.communicate.MailService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class MailServiceImpl extends BaseServiceImpl<Mail> implements MailService{
	private MailDao dao;
	
	public MailServiceImpl(MailDao dao) {
		super(dao);
		this.dao=dao;
	}

}