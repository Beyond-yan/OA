package com.gdssoft.oa.service.out;

import java.util.Date;
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.out.OutPerson;

public interface OutPersonService extends BaseService<OutPerson> {

	/**
	 * 在有部门参数时查询OutPerson
	 * @param deleted
	 * @param fullname
	 * @param depName
	 * @param sdt
	 * @param edt
	 * @param size
	 * @param start
	 * @return
	 */
	List<OutPerson> find(int deleted, String fullname, String depName,
			Date sdt, Date edt, int size, int start);
	
	/**
	 * 
	 * @param deleted
	 * @param fullname
	 * @param depName
	 * @param sdt
	 * @param edt
	 * @return
	 */
	Long count(int deleted, String fullname, String depName, Date sdt,Date edt);
}
