package com.gdssoft.oa.service.task.impl;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
 */
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.gdssoft.oa.dao.task.AppointmentDao;
import com.gdssoft.oa.model.task.Appointment;
import com.gdssoft.oa.service.task.AppointmentService;
import com.gdssoft.core.engine.MailEngine;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class AppointmentServiceImpl extends BaseServiceImpl<Appointment>
		implements AppointmentService {

	@Resource
	private MailEngine mailEngine;
	private AppointmentDao dao;

	public AppointmentServiceImpl(AppointmentDao dao) {
		super(dao);
		this.dao = dao;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List showAppointmentByUserId(PagingBean pb) {
		return dao.showAppointmentByUserId(pb);
	}

	/**
	 * @description 信息提醒[1.Email提醒，2.手机短息提醒]
	 * @author YHZ
	 * @data 2010-9-17 PM
	 */
	@SuppressWarnings("unchecked")
	@Override
	public void warningAppointment() {
		List<Appointment> list = dao.warningAppointment();
		for (Appointment apm : list) {
			String email = apm.getAppUser().getEmail();// from email
			String phone = apm.getAppUser().getPhone();// from 手机号
			// Email提醒
			if (apm.getIsMsg() == 1 && !email.isEmpty()) {
				String tempPath = "mail/flowMail.vm"; // 模板
				Map hashMap = new HashMap();
				String subject = "来自未央区城管办公系统的待办任务提醒";
				mailEngine.sendTemplateMail(tempPath, hashMap, subject, email,
						new String[] { apm.getInviteEmails() }, null, null,
						null, null, true);
			}
			// 手机短息提醒
			if (apm.getIsMobile() == 1 && !phone.isEmpty()) {

			}
		}
	}
}