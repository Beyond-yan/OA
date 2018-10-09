package com.gdssoft.oa.dao.task.impl;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
 */
import java.util.List;

import com.gdssoft.oa.dao.task.AppointmentDao;
import com.gdssoft.oa.model.task.Appointment;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;

@SuppressWarnings("unchecked")
public class AppointmentDaoImpl extends BaseDaoImpl<Appointment> implements
		AppointmentDao {

	public AppointmentDaoImpl() {
		super(Appointment.class);
	}

	/**
	 * 读取约会列表在首页显示
	 */
	@Override
	public List showAppointmentByUserId( PagingBean pb) {
		StringBuffer hql = new StringBuffer(
				"select vo from Appointment vo order by vo.appointId desc");
		return findByHql(hql.toString(),null, pb);
	}

	/**
	 * @description 信息提醒
	 * @author YHZ
	 * @data 2010-9-17 PM
	 * @return List<Appointment>
	 */
	@Override
	public List<Appointment> warningAppointment() {
		String hql = "select vo from Appointment vo order by vo.startTime desc";
		return  findByHql(hql);
	}
}