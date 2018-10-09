package com.gdssoft.oa.job;

import java.util.Date;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.gdssoft.oa.model.admin.Car;
import com.gdssoft.oa.model.admin.CarApply;
import com.gdssoft.oa.model.admin.CarDriver;
import com.gdssoft.oa.service.admin.CarApplyService;
import com.gdssoft.oa.service.admin.CarDriverService;
import com.gdssoft.oa.service.admin.CarService;

/**
 * 
 * 定时 更新车辆和司机的状态
 * 
 * @author f7400185
 * 
 */
public class CarStatusJob {
	private static Log logger = LogFactory.getLog(CarStatusJob.class);
	private CarService carService;
	private CarApplyService carApplyService;
	private CarDriverService carDriverService;

	public void setCarService(CarService carService) {
		this.carService = carService;
	}

	public void setCarApplyService(CarApplyService carApplyService) {
		this.carApplyService = carApplyService;
	}

	public void setCarDriverService(CarDriverService carDriverService) {
		this.carDriverService = carDriverService;
	}

	public void doWork() {
		saveBlackList();
	}

	/**
	 * 
	 * 
	 * 定时 更新车辆和司机的状态
	 * 
	 * 
	 * 
	 */
	private void saveBlackList() {
//		List<Car> cars = carService.getUserFullCars(new Short("3"));
//		System.out.println("------cars-----" + cars.size());
//		for (Car car : cars) {
//			boolean notUse = true;
//			List<CarApply> carApplies = carApplyService.getUserFullCar(car
//					.getCarid(), new Date(), true);
//			if (carApplies.size() > 0) {
//				notUse = false;
//			}
//			if (notUse) {
//				car.setStatus(new Short("1"));// 更新车辆状态
//				carService.save(car);
//			}
//			System.out.println("----carApplies----" + carApplies.size());
//			List<CarApply> carApplies2 = carApplyService.getUserFullCar(car
//					.getCarid(), new Date(), false);
//			for (CarApply carApply : carApplies2) {
//				// 更新司机状态
//				if (carApply.getDriverId() != null) {
//					CarDriver carDriver = carDriverService.get(carApply
//							.getDriverId());
//					carDriver.setIsLeaving(new Short("1"));// 修改司机的状态
//					carDriverService.save(carDriver);
//					System.out.println("----carApply.driver-----"
//							+ carApply.getDriver());
//				}
//			}
//		}
	}
}