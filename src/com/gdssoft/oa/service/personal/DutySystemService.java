package com.gdssoft.oa.service.personal;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import com.gdssoft.oa.model.personal.DutySystem;
import com.gdssoft.core.service.BaseService;

public interface DutySystemService extends BaseService<DutySystem>{
	/**
	 * 取得缺省的班次
	 * @return
	 */
	public DutySystem getDefaultDutySystem();
}


