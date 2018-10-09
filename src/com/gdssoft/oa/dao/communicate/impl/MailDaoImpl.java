package com.gdssoft.oa.dao.communicate.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.communicate.MailDao;
import com.gdssoft.oa.model.communicate.Mail;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class MailDaoImpl extends BaseDaoImpl<Mail> implements MailDao{

	public MailDaoImpl() {
		super(Mail.class);
	}

}