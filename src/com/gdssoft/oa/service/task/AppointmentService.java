package com.gdssoft.oa.service.task;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
 */
import java.util.List;

import com.gdssoft.oa.model.task.Appointment;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;

public interface AppointmentService extends BaseService<Appointment> {
	@SuppressWarnings("unchecked")
	public List showAppointmentByUserId(PagingBean pb);

	/**
	 * @description 信息提醒
	 * @author YHZ
	 * @data 2010-9-17 PM
	 */
	public void warningAppointment();
}
