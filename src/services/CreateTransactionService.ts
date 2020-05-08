import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Transaction type is invalid', 500);
    }

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance', 400);
    }

    let categoryTransaction = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!categoryTransaction) {
      categoryTransaction = await categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryTransaction);
    }

    const transaction = await transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryTransaction.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
