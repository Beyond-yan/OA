package com.gdssoft.oa.dao.hrm;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.hrm.UserContract;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface UserContractDao extends BaseDao<UserContract>{
	//检查合同编号
	public boolean checkContractNo(String contractNo);
	
	//所需续约时间的总和
	public List<UserContract> findTime(Long contractId);
	
	public List<UserContract> findByExpireDate();
}