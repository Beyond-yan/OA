package com.gdssoft.oa.dao.hrm;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.hrm.ContractEvent;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface ContractEventDao extends BaseDao<ContractEvent>{
	/**
	 * 根据合同号查看合同类型
	 * */
	public List<ContractEvent> findByContractId(Long contractId);
}