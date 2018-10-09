package com.gdssoft.oa.dao.task;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.List;

import com.gdssoft.oa.model.task.Appointment;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * 
 * @author
 * 
 */
public interface AppointmentDao extends BaseDao<Appointment> {
	// 首页中根据当前登录用户显示约会列表
	@SuppressWarnings("unchecked")
	public List showAppointmentByUserId(PagingBean pb);

	/**
	 * @description 信息提醒
	 * @author YHZ
	 * @data 2010-9-17 PM
	 * @return List<Appointment>
	 */
	public List<Appointment> warningAppointment();
}