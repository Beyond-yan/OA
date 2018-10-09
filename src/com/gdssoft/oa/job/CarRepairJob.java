package com.gdssoft.oa.job;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.admin.CartRepair;
import com.gdssoft.oa.service.admin.CartRepairService;

/**
 * 
 * 定时遍历车辆维修表数据
 * 
 * @author f7400185
 * 
 */
public class CarRepairJob extends BaseAction {
	private static Log logger = LogFactory.getLog(CarRepairJob.class);

	public CartRepairService cartRepairService;

	public void setCartRepairService(CartRepairService cartRepairService) {
		this.cartRepairService = cartRepairService;
	}

	public void doWork() {
		saveBlackList();
	}

	/**
	 * 
	 * 遍历车辆维修表
	 * 
	 * 
	 * */
	private void saveBlackList() {
		// QueryFilter filter = new QueryFilter(getRequest());
		// filter.addFilter("Q_status_SN_EQ", "1");
		List<CartRepair> cartRepairs = cartRepairService.getAll();
//		System.out.println("-------cartRepairs------" + cartRepairs.size());
		// System.out.println("------cartRepairs------" + cartRepairs.size());
		for (CartRepair cartRepair : cartRepairs) {
			if (cartRepair.getStatus() != null
					&& cartRepair.getStatus() == 1
					&& cartRepair.getEndDt().getTime() <= System
							.currentTimeMillis()) {
				cartRepairService.updateCarStatus(cartRepair.getCar()
						.getCarid());
				cartRepair.setRepairType("完成");
				cartRepair.setStatus(new Short("2"));
				cartRepairService.save(cartRepair);
			}
		}
	}

}