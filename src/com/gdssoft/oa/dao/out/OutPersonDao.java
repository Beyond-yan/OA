package com.gdssoft.oa.dao.out;

import java.util.Date;
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.out.OutPerson;;

public interface OutPersonDao extends BaseDao<OutPerson> {

	/**
	 * 
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
	Long count(int deleted, String fullname, String depName, Date sdt,
			Date edt);

}
